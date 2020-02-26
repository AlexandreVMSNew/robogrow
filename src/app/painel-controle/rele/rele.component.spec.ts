/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReleComponent } from './rele.component';

describe('ReleComponent', () => {
  let component: ReleComponent;
  let fixture: ComponentFixture<ReleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
