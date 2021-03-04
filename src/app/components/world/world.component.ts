import { DatePipe } from '@angular/common';
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
  @Input() targetSrc: string;
  @Input() showLogs: boolean = true;

  //public logs: string[];
  //public completeTask: boolean = false;
  public showCoordenades: boolean = false;
  public status: { logs: string[], complete: boolean, actionsCount: number } = { logs: [], complete: false, actionsCount: 0 };

  constructor(private ref: ChangeDetectorRef, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['problem'] && changes['woldArrMap']) {
      this.ref.markForCheck();
      console.log(this.problem, this.woldArrMap)
    }
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
      this.status = { logs: [], complete: false, actionsCount: 0 };
      this.problem.solve(this.woldArrMap, {
        onFinish: (data) => this.onFinishController(data),
        onTurn: (data) => this.onTurnController(data)
      });
    }
  }

  hasAgentIn(state) {
    return Object.keys(this.problem.controller.agents).find(agentID => {
      const agent = this.problem.controller.agents[agentID];
      const agentState = this.problem.controller.data.states[agentID] || agent.initialState;
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
      const agentState = this.problem.controller.data.states[agentID] || agent.initialState;
      return agentState.x == state.x && agentState.y == state.y;
    }).map(agentID => this.problem.controller.agents[agentID]);
  }

  onFinishController(result) {
    for (const agentID in result.agents) {
      const agentCompleteTask = this.problem.agentSolveProblem(agentID);
      this.status.logs.push(this.logMap({ action: agentCompleteTask ? this.problem.GoalCompleteMessage : this.problem.GoalIncompleteMessage, agentID: agentID, at: new Date() }));
    }
    this.status.complete = true;
    this.ref.markForCheck();
  }

  onTurnController(result) {
    this.status.logs = result.actions.map(log => this.logMap(log));
    this.status.actionsCount = result.actions.length;
    this.ref.markForCheck();
  }

  private logMap(log: { action: string, at: Date, agentID: string }) {
    return `<span class="_lblue">${this.datePipe.transform(log.at, 'mediumTime')}</span>: Agent <span class="_lred">${log.agentID}</span> make the action <span class="_lgreen">${log.action}</span>`
  }

}
