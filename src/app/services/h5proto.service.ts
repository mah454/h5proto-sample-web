import {Injectable} from '@angular/core';
import {Message, Packet, Request, RequestType, Rpc} from '../protobuf/MessageStructure_pb';
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';
import {ObserverService} from './observer.service';

@Injectable()
export class H5protoService {

  public ecdhPublicKey: CryptoKey;
  private ecdhPrivateKey: CryptoKey;
  private sharedSecret: CryptoKey;
  private sharedSecretBytes: ArrayBuffer;
  private salt = '';
  verified: boolean;

  constructor(private obsService: ObserverService) {
    this.generateECDHKeys()
      .then(e => {
        this.ecdhPublicKey = e.publicKey;
        this.ecdhPrivateKey = e.privateKey;
      });
  }

  /* PBKDF2 */
  private importKey(accessHash) {
    return crypto.subtle.importKey(
      'raw',
      accessHash,
      {name: 'PBKDF2', length: 256},
      false,
      ['deriveKey']
    );
  }

  private generateAESKey(baseKey, salt) {
    const encSalt = new TextEncoder().encode(salt);
    const algorithm = {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: 1024,
      salt: encSalt
    };
    return crypto.subtle.deriveKey(
      algorithm,
      baseKey,
      {name: 'AES-GCM', length: 256},
      true,
      ['encrypt', 'decrypt']
    );
  }

  /* AES GCM Encryption and Decryption */
  private encrypt(msg, securePassword: CryptoKey, iv) {
    const algorithm = {
      name: 'AES-GCM',
      iv,
    };
    return crypto.subtle.encrypt(
      algorithm,
      securePassword,
      msg
    );
  }

  private decrypt(cipher, securePassword: CryptoKey, iv) {
    const algorithm = {
      name: 'AES-GCM',
      iv,
    };

    return crypto.subtle.decrypt(
      algorithm,
      securePassword,
      cipher
    );
  }

  /* ECDH Methods */

  private generateECDHKeys() {
    const ECDH_ALGORITHM = {name: 'ECDH', namedCurve: 'P-256'};
    return crypto.subtle.generateKey(ECDH_ALGORITHM, false, ['deriveKey']);
  }

  public exportECDHKey(key: CryptoKey) {
    return crypto.subtle.exportKey('raw', key);
  }

  public importECDHPublicKey(publicKey: Uint8Array) {
    return crypto.subtle.importKey(
      'raw',
      publicKey,
      {name: 'ECDH', namedCurve: 'P-256'},
      false,
      []
    );
  }

  public deriveECDHSecretKey(privateKey, publicKey) {
    const algorithm = {
      name: 'ECDH',
      public: publicKey,
    };
    const derivedKeyType = {
      name: 'AES-GCM',
      length: 256,
    };
    return crypto.subtle.deriveKey(
      algorithm,
      privateKey,
      derivedKeyType,
      true,
      ['encrypt', 'decrypt']
    );
  }

  public generateSharedSecretKey(publicKey: Uint8Array) {
    this.importECDHPublicKey(publicKey)
      .then(e => this.deriveECDHSecretKey(this.ecdhPrivateKey, e))
      .then(e => this.sharedSecret = e)
      .then(e => this.exportECDHKey(e))
      .then(e => {
        this.sharedSecretBytes = e;
        localStorage.setItem('h5_shared_secret', btoa(String.fromCharCode(...new Uint8Array(this.sharedSecretBytes))));
        this.obsService.connection.next(true);
      });
  }

  private getAccessKey(sha256: Uint8Array) {
    const salt = new TextEncoder().encode(this.salt);
    const sharedSecret = new Uint8Array(this.sharedSecretBytes);
    const accessKey = new Uint8Array(sharedSecret.byteLength + sha256.length + salt.length);
    accessKey.set(sharedSecret);
    accessKey.set(sha256, sharedSecret.byteLength);
    accessKey.set(salt, sharedSecret.byteLength + sha256.byteLength);
    return accessKey;
  }

  public encryptMessage(msg) {
    const iv = this.generateIV();

    const msgBuf = new Message();
    msgBuf.setContent(msg);
    msgBuf.setDate(new Timestamp());
    const msgBinary = msgBuf.serializeBinary();
    const pktBuf = new Packet();

    return crypto.subtle.digest('sha-256', new TextEncoder().encode(msg))
      .then(e => {
        pktBuf.setAccesskey(new Uint8Array(e));
        return this.getAccessKey(new Uint8Array(e));
      })
      .then(e => this.importKey(e))
      .then(e => this.generateAESKey(e, this.salt))
      .then(e => this.encrypt(msgBinary, e, iv))
      .then(e => {
        pktBuf.setIv(iv);
        pktBuf.setMessage(new Uint8Array(e));
        const req = new Request();
        req.setPacket(pktBuf);
        req.setType(RequestType.PACKET);
        return req;
      });
  }

  public encryptRpc(rpc: Rpc) {
    const iv = this.generateIV();

    const pktBuf = new Packet();
    const rpcBin = rpc.serializeBinary();
    return crypto.subtle.digest('sha-256', new TextEncoder().encode(rpc.getCmd().toString()))
      .then(e => {
        pktBuf.setAccesskey(new Uint8Array(e));
        return this.getAccessKey(new Uint8Array(e));
      })
      .then(e => this.importKey(e))
      .then(e => this.generateAESKey(e, this.salt))
      .then(e => this.encrypt(rpcBin, e, iv))
      .then(e => {
        pktBuf.setIv(iv);
        pktBuf.setRpc(new Uint8Array(e));
        const req = new Request();
        req.setPacket(pktBuf);
        req.setType(RequestType.RPC);
        return req;
      });
  }


  public decryptMessage(packet: Packet) {
    const iv = packet.getIv_asU8();
    const sha256: Uint8Array = packet.getAccesskey_asU8();
    const encMessage = packet.getMessage_asU8();
    const accessKey = this.getAccessKey(sha256);

    return this.importKey(accessKey)
      .then(e => this.generateAESKey(e, this.salt))
      .then(e => this.decrypt(encMessage, e, iv))
      .then(e => Message.deserializeBinary(new Uint8Array(e)));
  }

  public decryptRpc(packet: Packet) {
    const iv = packet.getIv_asU8();
    const sha256: Uint8Array = packet.getAccesskey_asU8();
    const encRpc = packet.getRpc_asU8();
    const accessKey = this.getAccessKey(sha256);

    return this.importKey(accessKey)
      .then(e => this.generateAESKey(e, this.salt))
      .then(e => this.decrypt(encRpc, e, iv))
      .then(e => Rpc.deserializeBinary(new Uint8Array(e)));
  }

  /* Utils */
  public generateIV() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  public setSalt(salt: string) {
    this.salt = salt;
    localStorage.setItem('h5_salt', salt);
  }

  public invalidateCredential() {
    this.salt = '';
    this.verified = false;
    localStorage.removeItem('h5_salt');
    localStorage.removeItem('uuid');
  }
}
