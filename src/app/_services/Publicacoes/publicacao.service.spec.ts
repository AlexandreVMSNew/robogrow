/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicacaoService } from './publicacao.service';

describe('Service: Publicacao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicacaoService]
    });
  });

  it('should ...', inject([PublicacaoService], (service: PublicacaoService) => {
    expect(service).toBeTruthy();
  }));
});
