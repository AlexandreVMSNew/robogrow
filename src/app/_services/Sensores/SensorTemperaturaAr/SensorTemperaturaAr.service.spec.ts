/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SensorTemperaturaArService } from './SensorTemperaturaAr.service';

describe('Service: SensorTemperaturaAr', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SensorTemperaturaArService]
    });
  });

  it('should ...', inject([SensorTemperaturaArService], (service: SensorTemperaturaArService) => {
    expect(service).toBeTruthy();
  }));
});
