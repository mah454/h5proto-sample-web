import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {delay, retryWhen} from 'rxjs/operators';
import {server} from '../dandelion';
import {H5protoService} from './h5proto.service';
import {MessageHandler} from './MessageHandler';
import {Auth, PublicKey, Request, RequestType, Rpc} from '../protobuf/MessageStructure_pb';
import {ObserverService} from './observer.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  isConnected: boolean;
  private ws = webSocket({
    url: server.protocol + '://' + server.host + ':' + server.port + '/iot',
    binaryType: 'arraybuffer',
    openObserver: {
      next: () => this.onConnect()
    },
    closeObserver: {
      next: () => this.obsService.connection.next(false)
    },
    closingObserver: {
      next: () => console.log('closing Ok')
    },
    serializer: (req: Request) => MessageHandler.getInstance().serializeToBufferArray(req),
    deserializer: ({data}) => MessageHandler.getInstance().deserializeToPacket(data)
  });

  constructor(private h5proto: H5protoService, private obsService: ObserverService) {
    this.connect();
    this.obsService.connection.subscribe(e => this.isConnected = e);
  }

  public connect() {
    this.ws
      .pipe(retryWhen(e => e.pipe(delay(100))))
      .pipe(e => e.pipe(delay(100)))
      .subscribe(
        req => {
          this.obsService.requestSubject.next(req);
        },
        err => console.log(err),
        () => console.log('Completed')
      );
  }

  public onConnect() {
    console.log('Successfully connected to server');
    this.sendPublicKey();
  }

  public sendMessage(msg: string) {
    this.h5proto.encryptMessage(msg)
      .then(e => this.ws.next(e));
  }

  public sendRpc(rpc: Rpc) {
    this.h5proto.encryptRpc(rpc)
      .then(e => this.ws.next(e));
  }

  public sendPublicKey() {
    this.h5proto.exportECDHKey(this.h5proto.ecdhPublicKey).then(e => {
      const pk = new PublicKey();
      pk.setEncodedkey(new Uint8Array(e));
      const req = new Request();
      req.setType(RequestType.PUBLIC_KEY);
      req.setPublickey(pk);
      this.ws.next(req);
    });
  }

  public sendIdentity(identity: string) {
    const auth = new Auth();
    auth.setIdentity(new TextEncoder().encode(identity));
    const req = new Request();
    req.setType(RequestType.AUTH);
    req.setAuth(auth);
    this.ws.next(req);
  }
}
