import { Component, OnInit } from '@angular/core';
import { SocketService } from '../_services/WebSocket/Socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  ioConnection: any;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
  }

}
