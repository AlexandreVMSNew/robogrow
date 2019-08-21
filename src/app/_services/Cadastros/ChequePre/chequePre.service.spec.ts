/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChequePreService } from './chequePre.service';

describe('Service: ChequePre', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChequePreService]
    });
  });

  it('should ...', inject([ChequePreService], (service: ChequePreService) => {
    expect(service).toBeTruthy();
  }));
});
