import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WorldComponent } from './world.component';
import { WBlockModule } from '../w-block/w-block.module';
import { AgentModule } from '../agent/agent.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WorldComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    WBlockModule,
    AgentModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [WorldComponent]
})
export class WorldModule { }
