/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SensoresComponent } from './sensores.component';

describe('SensoresComponent', () => {
  let component: SensoresComponent;
  let fixture: ComponentFixture<SensoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
