import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphInterface } from 'src/app/interfaces/graph.interface';
import { PRJ } from 'src/app/consts/projectConst';


@Injectable({
  providedIn: 'root'
})
export class GraphService {
  showEsri = false;
  graphs: GraphInterface[] = [];
  graphSubject = new Subject<GraphInterface>();

  constructor() { }

  clearGraphs() {
    this.graphs = [];
    this.graphSubject.next();
  }

  emitGraph(graph) {
    graph.layout.width = 800;
    graph.layout.height = 600;
    graph.layout.plot_bgcolor = PRJ.BG_COLOR_STR;
    graph.layout.paper_bgcolor = PRJ.BG_COLOR_STR;
    graph.layout.font = {
      family: 'Courier New, monospace',  //'Roboto',
      size: 16,
      color: PRJ.FG_COLOR_STR
    };

    this.graphs.push(graph);
    this.graphSubject.next(graph);
  }

}
