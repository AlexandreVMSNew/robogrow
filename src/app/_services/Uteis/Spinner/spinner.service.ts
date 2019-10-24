import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinnerStatus = new EventEmitter<boolean>();
  contagemCarregamentos = 0;
  constructor() { }

  alterarSpinnerStatus(valor: boolean) {
    if (valor === false && this.contagemCarregamentos === 0) {
      this.spinnerStatus.emit(valor);
    } else if (valor === true) {
      this.contagemCarregamentos = this.contagemCarregamentos + 1;
      this.spinnerStatus.emit(valor);
    } else {
      this.contagemCarregamentos = this.contagemCarregamentos - 1;
      if (this.contagemCarregamentos === 0) {
        this.spinnerStatus.emit(valor);
      }
    }
  }

}
