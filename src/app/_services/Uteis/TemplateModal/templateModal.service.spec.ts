/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TemplateModalService } from './templateModal.service';

describe('Service: TemplateModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateModalService]
    });
  });

  it('should ...', inject([TemplateModalService], (service: TemplateModalService) => {
    expect(service).toBeTruthy();
  }));
});
