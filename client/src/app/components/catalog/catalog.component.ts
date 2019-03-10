import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog/catalog.service';
import { PRJ } from 'src/app/consts/projectConst';

// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  columnDefs = [
    {headerName: 'Variable', field: 'variable' },
    {headerName: 'Long Name', field: 'longName' },
    {headerName: 'Unit', field: 'unit'},
    {headerName: 'Table_Name', field: 'tableName'},
    {headerName: 'Make', field: 'make'},
    {headerName: 'Sensor', field: 'sensor'},
    {headerName: 'Process Level', field: 'processLevel'},
    {headerName: 'Study Domain', field: 'studyDomain'},
    {headerName: 'Temporal Resolution', field: 'temporalResolution'},
    {headerName: 'Spatial Resolution', field: 'spatialResolution'},
    {headerName: 'Comment', field: 'comment'},
    {headerName: 'Dataset Name', field: 'datasetName'},
    {headerName: 'Data Source', field: 'dataSource'},
    {headerName: 'Distributor', field: 'distributor'},
    {headerName: 'Dataset Description', field: 'datasetDescription'},
    {headerName: 'Dataset_ID', field: 'datasetID'},
    {headerName: 'ID', field: 'id'},
    {headerName: 'Keywords', field: 'keywords'}
  ];


  rowData: any;


  // constructor(private http: HttpClient) { }
  constructor( private catalogService: CatalogService) { }

  ngOnInit() {
    //this.rowData = this.http.get('http://localhost:3000/catalog');

      this.rowData = this.catalogService.getCatalog();
      this.rowData.subscribe((data) => {
      localStorage.setItem('catalog', JSON.stringify(data));
    });

  }


}
