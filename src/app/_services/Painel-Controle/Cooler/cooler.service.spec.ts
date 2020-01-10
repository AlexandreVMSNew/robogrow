/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoolerService } from './cooler.service';

describe('Service: Cooler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoolerService]
    });
  });

  it('should ...', inject([CoolerService], (service: CoolerService) => {
    expect(service).toBeTruthy();
  }));
});
