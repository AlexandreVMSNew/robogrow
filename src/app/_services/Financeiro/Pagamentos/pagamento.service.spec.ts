/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PagamentoService } from './pagamento.service';

describe('Service: Pagamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagamentoService]
    });
  });

  it('should ...', inject([PagamentoService], (service: PagamentoService) => {
    expect(service).toBeTruthy();
  }));
});
