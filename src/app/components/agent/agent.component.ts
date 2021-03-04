import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'bia-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'agent-component'
  }
})
export class AgentComponent implements OnInit {

  @Input() tarjetSrc = '/assets/jerry.png';

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding("style")
  get style() {
    return `background-image: url('${this.tarjetSrc || '/assets/jerry.png'}')`;
  }

}
