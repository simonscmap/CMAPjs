import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatInputModule,
         MatCardModule,
         MatButtonModule,
         MatNativeDateModule
         } from '@angular/material';

import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { EsriMapComponent } from './components/esri-map/esri-map.component';
import { QueryPanelComponent } from './components/query-panel/query-panel.component';
import { PlotlyModule } from 'angular-plotly.js';


//// services
import { CatalogService } from './services/catalog/catalog.service';
import { AuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { QueryService } from './services/query/query.service';
import { GraphComponent } from './components/graph/graph.component';
import { GraphService } from './services/graph/graph.service';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: SigninComponent},
  {path: 'register', component: SignupComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'cat', component: CatalogComponent},
  {path: 'viz', component: QueryPanelComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    SigninComponent,
    SignupComponent,
    ProfileComponent,
    HomeComponent,
    EsriMapComponent,
    QueryPanelComponent,
    GraphComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AgGridModule.withComponents([AppComponent]),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTabsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatMenuModule,
    MatNativeDateModule,
    PlotlyModule
  ],
  providers: [CatalogService,
              AuthService,
              AuthGuard,
              // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              QueryService,
              GraphService
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
