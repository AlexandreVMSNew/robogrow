/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TempUmidService } from './tempUmid.service';

describe('Service: TempUmid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempUmidService]
    });
  });

  it('should ...', inject([TempUmidService], (service: TempUmidService) => {
    expect(service).toBeTruthy();
  }));
});
