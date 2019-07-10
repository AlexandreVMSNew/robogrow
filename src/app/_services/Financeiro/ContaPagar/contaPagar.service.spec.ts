/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContaPagarService } from './contaPagar.service';

describe('Service: ContaPagar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContaPagarService]
    });
  });

  it('should ...', inject([ContaPagarService], (service: ContaPagarService) => {
    expect(service).toBeTruthy();
  }));
});
