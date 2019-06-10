/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermissaoService } from './permissao.service';

describe('Service: Permissao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissaoService]
    });
  });

  it('should ...', inject([PermissaoService], (service: PermissaoService) => {
    expect(service).toBeTruthy();
  }));
});
