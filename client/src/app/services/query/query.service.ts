import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

import { QueryInterface } from 'src/app/interfaces/query.interface';
import { PRJ } from '../../consts/projectConst';
import { DomainInterface } from 'src/app/interfaces/domain.interface';


@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private domain = PRJ.DOMAIN;
  domainSubject = new Subject<DomainInterface>();


  constructor(private http: HttpClient) { }


  customQuery(query) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    // const params = new HttpParams().set('query', query);
    // return this.http.get(`${this.domain}/sql/query`, {headers: headers, params: params} )
    const payload = {query: query};
    return this.http.post(`${this.domain}/sql/query`, payload, {headers: headers} )
  }


  storedProcedure(payload: QueryInterface) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.domain}/sql/sp`, payload, {headers: headers});
  }


  emitDomain(domain: DomainInterface) {
    this.domainSubject.next(domain);
  }

}
