/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GrupoClienteService } from './grupoCliente.service';

describe('Service: GrupoCliente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrupoClienteService]
    });
  });

  it('should ...', inject([GrupoClienteService], (service: GrupoClienteService) => {
    expect(service).toBeTruthy();
  }));
});
