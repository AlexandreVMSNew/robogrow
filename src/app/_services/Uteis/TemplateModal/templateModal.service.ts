import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateModalService {

  templateModal = false;

  constructor() { }

  setTemplateModalStatus(val: boolean) {
    this.templateModal = val;
  }

  getTemplateModalStatus() {
    return this.templateModal;
  }

}
