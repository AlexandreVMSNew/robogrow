/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReleService } from './rele.service';

describe('Service: Rele', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReleService]
    });
  });

  it('should ...', inject([ReleService], (service: ReleService) => {
    expect(service).toBeTruthy();
  }));
});
