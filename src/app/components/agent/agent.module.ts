import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentComponent } from './agent.component';

@NgModule({
  declarations: [AgentComponent],
  imports: [
    CommonModule
  ],
  exports: [AgentComponent]
})
export class AgentModule { }
