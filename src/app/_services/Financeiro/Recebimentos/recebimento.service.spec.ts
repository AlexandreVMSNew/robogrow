/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecebimentoService } from './recebimento.service';

describe('Service: Recebimento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecebimentoService]
    });
  });

  it('should ...', inject([RecebimentoService], (service: RecebimentoService) => {
    expect(service).toBeTruthy();
  }));
});
