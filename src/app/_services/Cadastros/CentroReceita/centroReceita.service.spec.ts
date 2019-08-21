/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CentroReceitaService } from './centroReceita.service';

describe('Service: CentroReceita', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroReceitaService]
    });
  });

  it('should ...', inject([CentroReceitaService], (service: CentroReceitaService) => {
    expect(service).toBeTruthy();
  }));
});
