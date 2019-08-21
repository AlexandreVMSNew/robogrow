/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormaPagamentoService } from './formaPagamento.service';

describe('Service: FormaPagamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormaPagamentoService]
    });
  });

  it('should ...', inject([FormaPagamentoService], (service: FormaPagamentoService) => {
    expect(service).toBeTruthy();
  }));
});
