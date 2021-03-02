import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldComponent } from './world.component';
import { WBlockModule } from '../w-block/w-block.module';
import { AgentModule } from '../agent/agent.module';

@NgModule({
  declarations: [WorldComponent],
  imports: [
    CommonModule,
    WBlockModule,
    AgentModule
  ],
  exports: [WorldComponent]
})
export class WorldModule { }
