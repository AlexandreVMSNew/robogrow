/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContaReceberService } from './contaReceber.service';

describe('Service: ContaReceber', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContaReceberService]
    });
  });

  it('should ...', inject([ContaReceberService], (service: ContaReceberService) => {
    expect(service).toBeTruthy();
  }));
});
