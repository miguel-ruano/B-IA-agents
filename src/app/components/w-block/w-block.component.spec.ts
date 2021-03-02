import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WBlockComponent } from './w-block.component';

describe('WBlockComponent', () => {
  let component: WBlockComponent;
  let fixture: ComponentFixture<WBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
