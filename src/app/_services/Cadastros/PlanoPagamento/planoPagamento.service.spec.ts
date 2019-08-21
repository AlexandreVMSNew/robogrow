/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlanoPagamentoService } from './planoPagamento.service';

describe('Service: PlanoPagamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanoPagamentoService]
    });
  });

  it('should ...', inject([PlanoPagamentoService], (service: PlanoPagamentoService) => {
    expect(service).toBeTruthy();
  }));
});
