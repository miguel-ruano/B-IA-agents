import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bia-w-block',
  templateUrl: './w-block.component.html',
  styleUrls: ['./w-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WBlockComponent implements OnInit {

  @Input() layout: 'empty' | 'block' | 'target' = 'empty';
  @Input() targetSrc: string;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

  get style() {
    return this.layout == 'target' ? { 'background-image': `url(${this.targetSrc})` } : null;
  }


}
