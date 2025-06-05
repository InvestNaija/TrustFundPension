/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransferredComponent } from './transferred.component';

describe('TransferredComponent', () => {
  let component: TransferredComponent;
  let fixture: ComponentFixture<TransferredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
