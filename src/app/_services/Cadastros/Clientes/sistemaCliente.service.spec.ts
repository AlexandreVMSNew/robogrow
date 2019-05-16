/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SistemaClienteService } from './sistemaCliente.service';

describe('Service: SistemaCliente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SistemaClienteService]
    });
  });

  it('should ...', inject([SistemaClienteService], (service: SistemaClienteService) => {
    expect(service).toBeTruthy();
  }));
});
