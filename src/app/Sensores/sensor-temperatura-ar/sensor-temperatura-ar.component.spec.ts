/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SensorTemperaturaArComponent } from './sensor-temperatura-ar.component';

describe('SensorTemperaturaArComponent', () => {
  let component: SensorTemperaturaArComponent;
  let fixture: ComponentFixture<SensorTemperaturaArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorTemperaturaArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorTemperaturaArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
