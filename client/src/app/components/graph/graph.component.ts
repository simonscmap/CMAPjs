import { Component, OnInit, OnDestroy } from '@angular/core';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GraphInterface } from 'src/app/interfaces/graph.interface';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {

  constructor(private graphService: GraphService) { }
  graphs: GraphInterface[] = this.graphService.graphs;


  ngOnInit() {
    this.graphService.graphSubject.subscribe(graph => {
      this.graphs = this.graphService.graphs;
    });
  }

  ngOnDestroy() {
    this.graphService.graphSubject.unsubscribe();
  }
}
