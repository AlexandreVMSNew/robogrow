import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';

export interface Dados {
    info: any;
}

@Injectable()
export class SocketService {

    private url = location.protocol + '//' + location.hostname + '';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendSocket(evento: string, dados: any) {
        this.socket.emit(evento, dados);
    }

    public getSocket(evento: string) {
    // tslint:disable-next-line: deprecation
        return Observable.create((observer) => {
            this.socket.on(evento, (dados) => {
                observer.next(dados);
            });
        });
    }
}
