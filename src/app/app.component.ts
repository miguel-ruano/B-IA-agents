import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UTILS } from '.';
import { Problem } from './core';
import { CheeseProblem, MouseAgent } from './models';

interface AppSettings {
  world: number[][], position: { x: number, y: number }, animationSpeed: number, agentSmart: boolean,
  maxIterations: number, targetSrc: string, agentCommands: { [key: string]: any }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  problem: Problem;
  problemSettings: AppSettings;

  private _form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.problemSettings = this.settings;
    this.cheeseProblem(this.problemSettings);
  }

  initState() {
    this.problemSettings = this.settings;
    this.cheeseProblem(this.problemSettings);
  }

  start(world_component = null) {
    if (this.form.valid) {
      this.initState()
      this.cheeseProblem(this.problemSettings);
      if (world_component) {
        setTimeout(() => {
          world_component.start();
        }, 10);
      }
    }
  }

  get form(): FormGroup {
    if (!this._form) {
      this._form = this.fb.group({
        'animationSpeed': [200, Validators.required],
        'maxIterations': [100, Validators.required],
        'agentCommands': [JSON.stringify(UTILS.CONSTANTS.COMMANDS1)],
        'agentSmart': [false, Validators.required],
        'targetSrc': ['/assets/cheese.png'],
        'ip_x': [UTILS.CONSTANTS.POSITIONS1.x, Validators.required],
        'ip_y': [UTILS.CONSTANTS.POSITIONS1.y, Validators.required],
        'world': [JSON.stringify(UTILS.CONSTANTS.MAP1), Validators.required]
      });
    }
    return this._form;
  }

  get settings(): AppSettings {
    const form = this.form.getRawValue();
    return {
      world: JSON.parse(form.world), position: { x: form.ip_x, y: form.ip_y },
      maxIterations: form.maxIterations, targetSrc: form.targetSrc, agentSmart: form.agentSmart,
      agentCommands: JSON.parse(form.agentCommands), animationSpeed: form.animationSpeed
    };
  }

  cheeseProblem(settings: AppSettings) {
    this.problem = new CheeseProblem({ maxIterations: settings.maxIterations, ui: { actionDelay: settings.animationSpeed } });
    this.problem.addAgent('Jerry', { smart: settings.agentSmart, commands: settings.agentCommands }, MouseAgent, settings?.position || { x: 0, y: 2 });
  }

}
