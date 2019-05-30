/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IdeiaService } from './ideia.service';

describe('Service: Ideia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdeiaService]
    });
  });

  it('should ...', inject([IdeiaService], (service: IdeiaService) => {
    expect(service).toBeTruthy();
  }));
});
