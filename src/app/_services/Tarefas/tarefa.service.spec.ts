/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TarefaService } from './tarefa.service';

describe('Service: Tarefa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TarefaService]
    });
  });

  it('should ...', inject([TarefaService], (service: TarefaService) => {
    expect(service).toBeTruthy();
  }));
});
