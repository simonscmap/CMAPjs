import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { QueryService } from 'src/app/services/query/query.service';
import { DomainInterface } from 'src/app/interfaces/domain.interface';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  /**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map
   */
  private _zoom: number = 2;
  private _center: Array<number> = [-122.3321, 37.6062];
  private _basemap: string = 'hybrid';


  private lats: number[];
  private lons: number[];


  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor(private dbQuery: QueryService) { }




  async initializeMap() {
    try {
      const [EsriMap,
            // EsriMapView,
            EsriSceneView,
            // EsriBasemapGallery,
            // Sketch,
            // SketchViewModel,
            // GraphicsLayer,
            AreaMeasurement3D,
            Fullscreen,
            Search,
            FeatureLayer,
            SimpleRenderer,
            PointSymbol3D,
            ObjectSymbol3DLayer
          ] = await loadModules([
        'esri/Map',
        // 'esri/views/MapView',
        'esri/views/SceneView',
        // 'esri/widgets/BasemapGallery',
        // 'esri/widgets/Sketch',
        // 'esri/widgets/Sketch/SketchViewModel',
        // 'esri/layers/GraphicsLayer',
        'esri/widgets/AreaMeasurement3D',
        'esri/widgets/Fullscreen',
        'esri/widgets/Search',
        'esri/layers/FeatureLayer',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/PointSymbol3D',
        'esri/symbols/ObjectSymbol3DLayer'
      ]);


    //   // Set type of map
    //   const mapProperties: esri.MapProperties = {
    //     basemap: this._basemap
    //   };

    //   const map: esri.Map = new EsriMap(mapProperties);

    //   // Set type of map view
    //   const mapViewProperties: esri.MapViewProperties = {
    //     container: this.mapViewEl.nativeElement,
    //     center: this._center,
    //     zoom: this._zoom,
    //     map: map
    //   };

    //   const view: esri.MapView = new EsriMapView(mapViewProperties);


    //   // All resources in the MapView and the map have loaded.
    //   // Now execute additional processes
    //   view.when(() => {
    //     this.mapLoaded.emit(true);
    // });




      // ///////////  3d renderer ///////////
      // const graticule = new FeatureLayer({
      //   url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/World_graticule_15deg/FeatureServer',
      //   opacity: 0.6,
      //   legendEnabled: false
      // });

      // ///////////////////////////////////



      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      //  layers: [graticule],
      //  ground: {
      //    surfaceColor: '#eaf2ff'
      //  }
      };
      const map: esri.Map = new EsriMap(mapProperties);

      const sceneViewProperties: esri.SceneViewProperties = {
        map: map,
        center: this._center,
        container: this.mapViewEl.nativeElement
      };
      const view: esri.SceneView = new EsriSceneView(sceneViewProperties);


      // **************** widgets *********************
      const measurementWidget = new AreaMeasurement3D({
        view: view
      });

      view.ui.add(measurementWidget, 'top-right');

      measurementWidget.watch('viewModel.measurement.area.text', () => {
        const data = measurementWidget.viewModel.tool.model.viewData.positionsGeographic;
        if (data.length < 1) { return; }

        this.lons = data.map(a => a[0]);
        this.lats = data.map(a => a[1]);

        const domain: DomainInterface = {
        lat1: Math.min(...this.lats),
        lat2: Math.max(...this.lats),
        lon1: Math.min(...this.lons),
        lon2: Math.max(...this.lons)
        };

        this.dbQuery.emitDomain(domain);
      });

      // let pointx = [];
      // let pointy = [];
      // view.on('click', function(event){
      //   pointx.push(event.mapPoint.longitude);
      //   pointy.push(event.mapPoint.latitude);
      // });


      const fullscreen = new Fullscreen({
        view: view
      });
      view.ui.add(fullscreen, 'bottom-left');

      const searchWidget = new Search({
        view: view
      });
      view.ui.add(searchWidget, {
        position: 'bottom-right',
        index: 0
      });
      // ******************************************




    /////////////// 3d visualization renderer  /////////////////
    const stops = [
      {
        value: 0,
        size: 100000,
        color: '#FFFFE1'
      },
      {
        value: 400000,
        size: 250000,
        color: '#F3758C'
      },
      {
        value: 7000000,
        size: 1500000,
        color: '#7D2898'
      },
      {
        value: 30000000,
        size: 3500000,
        color: '#4C1E6E'
      }
    ];


    const ren = function getRenderer(year) {
      return new SimpleRenderer({
        symbol: new PointSymbol3D({
          symbolLayers: [new ObjectSymbol3DLayer({
            resource: {
              primitive: 'cube'
            },
            anchor: 'bottom',
            width: 80000
          })]
        }),
        visualVariables: [{
          type: 'color',
          field: 'pop' + year,
          stops: stops,
          legendOptions: {
            title: 'Number of persons/grid unit'
          }
        }, {
          type: 'size',
          field: 'pop' + year,
          stops: stops,
          axis: 'height',
          legendOptions: {
            showLegend: false
          }
        }, {
          type: 'size',
          axis: 'width-and-depth',
          useSymbolValue: true, // uses the width value defined in the symbol layer (80,000)
          legendOptions: {
            showLegend: false
          }
        }]
      });
    }



    for (let i = 2020; i <= 2020; i += 5) {
      const layer = new FeatureLayer({
        url: 'https://services2.arcgis.com/cFEFS0EWrhfDeVw9/arcgis/rest/services/World_population/FeatureServer',
        opacity: 0,
        outFields: ['*'],
        renderer: ren(i),
        title: 'Population ' + i.toString(),
        legendEnabled: false
      });

      map.layers.add(layer);
    }

    ////////////////////////////////////////////////////////////////////





      view.when(() => {
        this.mapLoaded.emit(true);

      });


    } catch (error) {
      console.log('We have an error: ' + error);
    }

  }

  ngOnInit() {
    this.initializeMap();
    }


  }




