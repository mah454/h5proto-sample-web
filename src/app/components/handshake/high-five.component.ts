import {Component, DoCheck} from '@angular/core';
import {WebSocketService} from '../../services/web-socket.service';
import {H5protoService} from '../../services/h5proto.service';
import {RpcCommand} from '../../services/RpcCommand';
import {Rpc} from '../../protobuf/MessageStructure_pb';
import {Router} from '@angular/router';
import {ObserverService} from '../../services/observer.service';

@Component({
  selector: 'app-handshake',
  templateUrl: './high-five.component.html',
  styleUrls: ['./high-five.component.scss']
})
export class HighFiveComponent implements DoCheck {
  state = 0;
  phoneNumber: string;
  activationKey: string;
  activationKeyPlaceHolder = 'Activation Code';
  isValidActivationKey = true;

  constructor(private wss: WebSocketService,
              private h5proto: H5protoService,
              private router: Router,
              private obsService: ObserverService) {
    // const salt = localStorage.getItem('h5_salt');
    // const uuid = localStorage.getItem('uuid');
    // if (salt && uuid) {
    //   router.navigate(['']).then();
    // }
  }

  public setState(num: number) {
    this.state = num;
    if (this.state === 0) {
      this.activationKey = '';
      this.phoneNumber = '';
    }
  }

  public sendIdentity() {
    this.wss.sendIdentity(this.phoneNumber);
    this.setState(1);
  }

  public isConnectedToServer() {
    return this.wss.isConnected;
  }

  public isMaxLength() {
    if (this.activationKey) {
      return this.activationKey.length === 6;
    }
  }

  public sendActivationKey() {
    if (this.isMaxLength()) {
      this.h5proto.setSalt(this.activationKey);
      const rpc = new Rpc();
      rpc.setCmd(RpcCommand.VERIFY_ACTIVATION_KEY);
      this.wss.sendRpc(rpc);
    }
  }

  public getTrueColor() {
    if (this.isValidActivationKey) {
      return '#BDBDBD';
    } else {
      return '#8c190b';
    }
  }

  ngDoCheck(): void {
    this.obsService.activationKey
      .subscribe(e => {
        console.log('H5Component activation: ' + e);
        if (!e) {
          this.activationKey = null;
          this.activationKeyPlaceHolder = 'Invalid Key';
        }
        this.isValidActivationKey = e;
      });
  }
}
