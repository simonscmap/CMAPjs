import { Component, OnInit } from '@angular/core';
import { QueryService } from 'src/app/services/query/query.service';
import { CatalogService } from 'src/app/services/catalog/catalog.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rowData: any;
  constructor(private dbQuery: QueryService,
              private catalogService: CatalogService,
              private router: Router) { }

  ngOnInit() {

    this.rowData = this.catalogService.getCatalog();
    this.rowData.subscribe((data) => {
    localStorage.setItem('catalog', JSON.stringify(data));
  });

  }



  onQuery() {
    const query = 'SELECT * FROM tblVariables';
    this.dbQuery.customQuery(query)
    .subscribe((data) => {
      console.log(data);
    }, (error: any) => {
      console.log(error);
    });
  }



  goRegister() {
    this.router.navigate(['/register']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goCatalog() {
    this.router.navigate(['/cat']);
  }

  goViz() {
    this.router.navigate(['/viz']);
  }





}
