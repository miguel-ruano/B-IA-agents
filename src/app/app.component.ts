import { Component, OnInit } from '@angular/core';
import { Problem } from './core';
import { ChesseProblem, MiceAgent } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'B-IA-agents';
  world = [
    [0, 0, 0, 0],
    [0, 1, 1, -1],
    [0, 1, 0, 0],
    [0, 0, 0, 1]
  ]

  problem: Problem;

  ngOnInit(): void {
    this.chesseProblem()
  }

  chesseProblem() {
    this.problem = new ChesseProblem({ maxIterations: 12 });
    this.problem.addAgent('Jerry', MiceAgent, { x: 0, y: 2 });
  }

}
