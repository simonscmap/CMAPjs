import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith, first } from 'rxjs/operators';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { QueryService } from 'src/app/services/query/query.service';
import { PRJ } from 'src/app/consts/projectConst';
import { QueryInterface } from 'src/app/interfaces/query.interface';
import { GraphInterface } from 'src/app/interfaces/graph.interface';
import { GraphService } from 'src/app/services/graph/graph.service';


declare var require: any;
const converter = require('json-2-csv');



/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.css']
})
export class QueryPanelComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;

  modelChip = false;
  satelliteChip = false;
  observationChip = false;


  startDate = new FormControl(new Date(2016, 4-1, 30));
  endDate = new FormControl(new Date(2016, 4-1, 30));
  lat1 = 20;
  lat2 = 45;
  lon1 = -180;
  lon2 = -126;
  depth1 = 0;
  depth2 = 0.5;

  exportData = false;

  separatorKeysCodes = [ENTER, COMMA];
  varCtrl = new FormControl();
  filteredVars: Observable<any[]>;
  tokens = [];
  allTokens = [];

  graphCount = 0;

  @ViewChild('tokenInput') tokenInput: ElementRef;

  constructor( private catalogService: CatalogService,
               private dbQuery: QueryService,
               private graphService: GraphService
               ) {

    this.allTokens = this.catalogService.localSmartCatalog();
    this.filteredVars = this.varCtrl.valueChanges.pipe(
      startWith(null),
      map((token: string | null) => token ? this.filter(token) : this.allTokens.slice()));
  }


  ngOnInit() {
    this.graphService.showEsri = true;
    this.dbQuery.domainSubject.subscribe(domain => {
      this.lat1 = Number(domain.lat1.toFixed(3));
      this.lat2 = Number(domain.lat2.toFixed(3));
      this.lon1 = Number(domain.lon1.toFixed(3));
      this.lon2 = Number(domain.lon2.toFixed(3));
    });

    this.graphService.graphSubject.subscribe(graph => {
      this.graphCount = this.graphService.graphs.length;
    });
}

  ngOnDestroy() {
    this.graphService.showEsri = false;
    this.graphService.graphSubject.unsubscribe();
  }

  chipClass(chipCaption: string) {
    return '';
    const varType: string = this.catalogService.typeByChipCaption(chipCaption).toLowerCase().trim();
    let chipClassName = varType;
    if (varType === 'model') {chipClassName = 'chip-model'}
    if (varType === 'observation') {chipClassName = 'chip-observation'}
    if (varType === 'satellite') {chipClassName = 'chip-satellite'}
    return chipClassName;
  }


  add(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    // Add token
    if ((value || '').trim()) {
      this.tokens.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.varCtrl.setValue(null);
  }

  remove(token: any): void {
    const index = this.tokens.indexOf(token);

    if (index >= 0) {
      this.tokens.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.allTokens.filter(token =>
        token.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tokens.push(event.option.viewValue);
    this.tokenInput.nativeElement.value = '';
    this.varCtrl.setValue(null);
  }


  validateQuery() {
    if ( (!this.tokens) || (this.tokens.length < 1) ) {
      return false;
    }

    return true;
  }

  spParams(spName, tableName, shortName): QueryInterface {
    const params: QueryInterface = {
      spName: spName,
      tableName: tableName,
      fields: shortName,
      dt1: this.startDate.value.getFullYear() + '-' +
          String(Number((this.startDate.value.getMonth()) + 1)) + '-' +
          this.startDate.value.getDate(),
      dt2: this.endDate.value.getFullYear() + '-' +
          String(Number((this.endDate.value.getMonth()) + 1)) + '-' +
          this.endDate.value.getDate(),
      lat1: String(this.lat1),
      lat2: String(this.lat2),
      lon1: String(this.lon1),
      lon2: String(this.lon2),
      depth1: String(this.depth1),
      depth2: String(this.depth2)
      };
      return params;
  }

  tokenToCatalog(token) {
    const splitToken = token.split(PRJ.CATALOG_DIVIDER);
    return this.catalogService.filterCatalogByVarNames(splitToken[0], splitToken[1]);
  }

  onTabClick(event) {
    if (event.index !== 0) { return; }
    this.graphService.clearGraphs();
  }


  downloadCSV(data, filename) {
    if (!this.exportData) { return; }
    converter.json2csv(data, (err, csv) => {
      if (err) {
        console.log(err);
      } else {
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }


  onMap() {
    const spName = 'uspSpaceTime';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `map_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a['lon']),
            y: data.map(a => a['lat']),
            z: data.map(a => a[cat['variable']]),
            name: cat['variable'],
            type: 'heatmap',
            }
          ],
          layout: {
            title: `${cat['variable']} [${cat['unit']}]`,
            xaxis: {title: 'Longitude'},
            yaxis: {title: 'Latitude'}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }


  onContour() {
    const spName = 'uspSpaceTime';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `contour_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a['lon']),
            y: data.map(a => a['lat']),
            z: data.map(a => a[cat['variable']]),
            name: cat['variable'],
            type: 'contour',
            contours: {
              coloring: 'heatmap',
              showlabels: true,
              labelfont: {
                family: 'Raleway',
                size: 12,
                color: 'white',
              }
            }
            }
          ],
          layout: {
            title: `${cat['variable']} [${cat['unit']}]`,
            xaxis: {title: 'Longitude'},
            yaxis: {title: 'Latitude'}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }


  onSectionMap() {
    const spName = 'uspSectionMap';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `sectionMap_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a['lat']),
            y: data.map(a => a['depth']),
            z: data.map(a => a[cat['variable']]),
            name: cat['variable'],
            type: 'heatmap',
            }
          ],
          layout: {
            title: `${cat['variable']} [${cat['unit']}]`,
            xaxis: {title: 'Latitude'},
            yaxis: {autorange: 'reversed', title: 'Depth [m]'}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }


  onSectionContour() {
    const spName = 'uspSectionMap';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `sectionContour_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a['lat']),
            y: data.map(a => a['depth']),
            z: data.map(a => a[cat['variable']]),
            name: cat['variable'],
            type: 'contour',
            contours: {
              coloring: 'heatmap',
              showlabels: true,
              labelfont: {
                family: 'Raleway',
                size: 12,
                color: 'white',
              }
            }
            }
          ],
          layout: {
            title: `${cat['variable']} [${cat['unit']}]`,
            xaxis: {title: 'Latitude'},
            yaxis: {autorange: 'reversed', title: 'Depth [m]'}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }


  onHistogram() {
    const spName = 'uspSpaceTime';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `histogram_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a[cat['variable']]),
            name: cat['variable'],
            type: 'histogram',
            marker: {color: '#17becf'}
            }
          ],
          layout: {
            title: cat['longName'],
            xaxis: {title: `${cat['variable']} [${cat['unit']}]`}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }




  onTimeSeries() {
    const spName = 'uspTimeSeries';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `timeSeries_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
            x: data.map(a => a['time']),
            y: data.map(a => a[cat['variable']]),
            error_y: {
              type: 'data',
              array: data.map(a => a[cat['variable'] + '_std']),
              opacity: 0.2,
              color: PRJ.FG_COLOR_STR, //  'gray',
              visible: true
            },
            name: cat['variable'],
            type: 'scatter',
            line: {color: '#e377c2'},
            },
          ],
          layout: {
            title: cat['longName'],
            xaxis: {title: 'Time'},
            yaxis: {title: `${cat['variable']} [${cat['unit']}]`}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }



  onDepthProfile() {
    const spName = 'uspDepthProfile';
    if (!this.validateQuery()) {
      return;
    }
    this.graphService.clearGraphs();
    for (let i = 0; i < this.tokens.length; i++) {
      const cat = this.tokenToCatalog(this.tokens[i]);
      const params = this.spParams(spName, cat['tableName'], cat['variable']);
      this.dbQuery.storedProcedure(params).subscribe((data: any[]) => {
        this.downloadCSV(data, `depthProfile_${cat['variable']}`);
        const graph: GraphInterface = {
          data: [
            {
              x: data.map(a => a['depth']),
              y: data.map(a => a[cat['variable']]),
              error_y: {
                type: 'data',
                array: data.map(a => a[cat['variable'] + '_std']),
                opacity: 0.2,
                color: 'gray',
                visible: true
              },
              name: cat['variable'],
              type: 'scatter',
              line: {color: '#e377c2'},
              },
          ],
          layout: {
            title: cat['longName'],
            xaxis: {title: 'Depth [m]'},
            yaxis: {title: `${cat['variable']} [${cat['unit']}]`}
          }
        };
        this.graphService.emitGraph(graph);
      }, (error: any) => {
          console.log(error);
    });
    }
  }


}
