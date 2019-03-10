import { Component } from '@angular/core';
import { GraphService } from './services/graph/graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(private graphService: GraphService) {}

  getShowEsri(): boolean {
    return this.graphService.showEsri;
  }
}
