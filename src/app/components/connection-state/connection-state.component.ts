import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '../../services/web-socket.service';

@Component({
  selector: 'app-connection-state',
  templateUrl: './connection-state.component.html',
  styleUrls: ['./connection-state.component.scss']
})
export class ConnectionStateComponent implements OnInit {

  constructor(private wss: WebSocketService) {
  }

  ngOnInit(): void {
  }

  public isConnectedToServer() {
    return this.wss.isConnected;
  }

}
