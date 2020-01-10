import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HubConnection } from '@aspnet/signalr';
export interface Dados {
    info: any;
}

@Injectable()
export class SocketService {

    public hubConnection: HubConnection;

    constructor() {
    }

    public iniciarConexao = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
                                .configureLogging(signalR.LogLevel.Debug)
                                .withUrl('https://www.vmsweb.com.br:4201/websockets', {
                                    skipNegotiation: true,
                                    transport: signalR.HttpTransportType.WebSockets
                                })
                                .build();
        this.hubConnection
          .start()
          .then(() => console.log('Connection started'))
          .catch(err => console.log('Error while starting connection: ' + err));
    }

    public getSocket = (evento: string) => {
        this.hubConnection.on(evento, (data) => {
            console.log(data);
        });
    }

    public sendSocket(dados) {
        this.hubConnection.invoke('EnviarMensagem', dados);
    }
}
