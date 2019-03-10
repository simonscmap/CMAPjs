import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PRJ } from '../../consts/projectConst';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private domain = PRJ.DOMAIN;
  constructor(private http: HttpClient) { }

  getCatalog() {
    return this.http.get(`${this.domain}/catalog`)
    // .subscribe((data) => {
    //   // let str = JSON.stringify(data);
    //   // str = JSON.stringify(data, null, 4);
    //   // console.log(str);
    // });
  }



  fetchLocalCatalog() {
    return JSON.parse(localStorage.getItem('catalog'));
    // const cleaner = JSON.stringify(catalogJSON, null, 4);
  }


  localCatalogField(field: string) {
    const cat = this.fetchLocalCatalog();
    return cat.map(a => a[field]);
  }


  localSmartCatalog() {
    const cat = this.fetchLocalCatalog();
    return cat.map(a => a['variable'] + PRJ.CATALOG_DIVIDER + a['longName']);
  }


  filterCatalogByVarNames(shortName: string, longName: string) {
    const cat = this.fetchLocalCatalog();
    return cat.filter(a => a['variable'].trim() === shortName.trim() && a['longName'].trim() === longName.trim())[0];
  }

  typeByVarNames(shortName: string, longName: string) {
    const cat = this.fetchLocalCatalog();
    const filteredVar = cat.filter(a => a['variable'].trim() === shortName.trim() && a['longName'].trim() === longName.trim());
    const make = filteredVar[0]['make'];
    const sensor = filteredVar[0]['sensor'];
    let varType = make;
    if (sensor.toLowerCase().trim() === 'satellite') {varType = 'Satellite'}
    return varType;
  }

  typeByChipCaption(chipCaption: string) {
    const names = chipCaption.split(PRJ.CATALOG_DIVIDER);
    if (names.length !== 2) {return ''}
    const varType = this.typeByVarNames(names[0], names[1]);
    return varType;
  }



}




