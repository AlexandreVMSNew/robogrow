/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanoContaService } from './planoConta.service';

describe('Service: PlanoConta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanoContaService]
    });
  });

  it('should ...', inject([PlanoContaService], (service: PlanoContaService) => {
    expect(service).toBeTruthy();
  }));
});
