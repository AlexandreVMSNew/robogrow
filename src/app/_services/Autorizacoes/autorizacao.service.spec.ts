/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutorizacaoService } from './autorizacao.service';

describe('Service: Autorizacao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutorizacaoService]
    });
  });

  it('should ...', inject([AutorizacaoService], (service: AutorizacaoService) => {
    expect(service).toBeTruthy();
  }));
});
