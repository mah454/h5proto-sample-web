import {Injectable} from '@angular/core';
import {Packet, PublicKey, Request, RequestType, Rpc} from '../protobuf/MessageStructure_pb';
import {H5protoService} from './h5proto.service';
import {Router} from '@angular/router';
import {RpcCommand} from './RpcCommand';
import {WebSocketService} from './web-socket.service';
import {ObserverService} from './observer.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public status: boolean;

  constructor(private h5proto: H5protoService,
              private router: Router,
              private wss: WebSocketService,
              private obsService: ObserverService) {
    obsService.requestSubject.subscribe(req => {
      this.requestHandler(req);
    });
  }

  public requestHandler(req: Request) {
    const type = req.getType();
    try {
      switch (type) {
        case RequestType.PUBLIC_KEY:
          this.handlePublicKey(req.getPublickey());
          break;
        case RequestType.PACKET:
          this.handlePacket(req.getPacket());
          break;
        case RequestType.RPC:
          this.handleRpc(req.getPacket());
          break;
      }
    } catch (e) {
      console.log('Invalid request on type ' + type);
    }
  }

  private handlePublicKey(publicKey: PublicKey) {
    this.h5proto.generateSharedSecretKey(publicKey.getEncodedkey_asU8());
  }

  private handlePacket(packet: Packet) {
    const msg = this.h5proto.decryptMessage(packet);
    msg.then(e => {
      console.log(e);
    });
  }

  private handleRpc(packet: Packet) {
    const rpc = this.h5proto.decryptRpc(packet);
    Promise.resolve().then(() => rpc)
      .then(r => {
        const cmd = r.getCmd();
        const data = r.getData_asU8();
        // console.log('RPC ' + cmd);
        if (cmd === RpcCommand.GIVE_USER_ACCESS) {
          this.accessToPanelGranted(r);
        } else if (cmd === RpcCommand.INVALID_ACTIVATION_KEY) {
          this.invalidateCredentials();
        } else if (cmd === RpcCommand.SET_UUID) {
          this.setUUID(data);
        } else if (cmd === RpcCommand.SET_ACTIVATION_KEY) {
          this.reinitializeActivationKey(data);
        }
      })
      .catch(e => {
        console.warn('Invalid Credential');
        this.h5proto.invalidateCredential();
        this.wss.sendPublicKey();
        this.obsService.activationKey.next(false);
        // this.router.navigate(['']).then();
      });
  }

  private reinitializeActivationKey(data: Uint8Array) {
    const a = String.fromCharCode(...data);
    this.h5proto.setSalt(a);
  }

  private setUUID(data: Uint8Array) {
    localStorage.setItem('uuid', String.fromCharCode(...data));
  }

  private invalidateCredentials() {
    console.warn('Credentials invalidated');
    this.h5proto.invalidateCredential();
    this.router.navigate([''])
      .then(() => this.obsService.activationKey.next(false));
  }

  private accessToPanelGranted(r: Rpc) {
    this.h5proto.verified = true;
    this.router.navigate(['/panel']).then();
    r.setCmd(RpcCommand.SEND_UUID);
    this.wss.sendRpc(r);
  }

  public checkCurrentConnectionStatus() {
    this.obsService.connection.subscribe(e => {
      this.status = e;
      if (e) {
        const salt = localStorage.getItem('h5_salt');
        const uuid = localStorage.getItem('uuid');
        if (salt && uuid) {
          this.h5proto.setSalt(salt);
          const rpc = new Rpc();
          rpc.setCmd(RpcCommand.VERIFY_ACTIVATION_KEY);
          this.wss.sendIdentity(uuid);
          this.wss.sendRpc(rpc);
        } else {
          this.router.navigate(['/highfive']).then();
        }
      }
    });
  }
}
