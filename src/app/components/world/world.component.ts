import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Agent, Problem } from 'src/app/core';

@Component({
  selector: 'bia-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldComponent implements OnInit, OnChanges {

  @Input() problem: Problem;
  @Input() woldArrMap: number[][];

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  get ready() {
    return this.woldArrMap && this.problem;
  }

  get worldStyle() {
    return {
      'max-width': `${this.woldArrMap.length * 50}px`
    }
  }

  start() {
    if (this.ready) {
      this.problem.solve(this.woldArrMap, {
        onFinish: (data) => this.onFinishController(data),
        onTurn: (data) => this.onTurnController(data)
      });
    }
  }

  hasAgentIn(state) {
    return Object.keys(this.problem.controller.agents).find(agentID => {
      const agent = this.problem.controller.agents[agentID];
      const agentState = agent.state || agent.initialState;
      return agentState.x == state.x && agentState.y == state.y;
    })
  }

  /**
   * determine if in the passed state has any agent in this moment
   * @param state state to evaluate
   */
  agentsIn(state): Agent[] {
    return Object.keys(this.problem.controller.agents).filter(agentID => {
      const agent = this.problem.controller.agents[agentID];
      const agentState = agent.state || agent.initialState;
      return agentState.x == state.x && agentState.y == state.y;
    }).map(agentID => this.problem.controller.agents[agentID]);
  }

  onFinishController(result) {
    let agentID = result.actions[result.actions.length - 1].agentID;
    console.log("agent: " + agentID);
    console.log(result.actions);
    let world = JSON.parse(JSON.stringify(result.data.world));
    let agentState = result.data.states[agentID];
    world[agentState.y][agentState.x] = "X"
    let status = 1;
    for (let line of world) {
      console.log(line)
      for (let cell of line)
        if (cell == -1)
          status = -1
    }

    if (status == -1)
      console.log("Agent cannot solve this problem :(")
    else
      console.log("Agent could solve this problem :)")

  }

  onTurnController(result) {
    console.log(new Date().toDateString() + " Turn: " + JSON.stringify(result.actions[result.actions.length - 1]))
    console.log(this.problem.controller.agents['Jerry']);
    this.ref.markForCheck();
  }

}
