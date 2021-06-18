// package: dandelion
// file: MessageStructure.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Request extends jspb.Message {
  getType(): RequestTypeMap[keyof RequestTypeMap];
  setType(value: RequestTypeMap[keyof RequestTypeMap]): void;

  hasPublickey(): boolean;
  clearPublickey(): void;
  getPublickey(): PublicKey | undefined;
  setPublickey(value?: PublicKey): void;

  hasAuth(): boolean;
  clearAuth(): void;
  getAuth(): Auth | undefined;
  setAuth(value?: Auth): void;

  hasPacket(): boolean;
  clearPacket(): void;
  getPacket(): Packet | undefined;
  setPacket(value?: Packet): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request.AsObject;
  static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request;
  static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
  export type AsObject = {
    type: RequestTypeMap[keyof RequestTypeMap],
    publickey?: PublicKey.AsObject,
    auth?: Auth.AsObject,
    packet?: Packet.AsObject,
  }
}

export class Rpc extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getSeqnumber(): number;
  setSeqnumber(value: number): void;

  getCmd(): number;
  setCmd(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rpc.AsObject;
  static toObject(includeInstance: boolean, msg: Rpc): Rpc.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Rpc, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Rpc;
  static deserializeBinaryFromReader(message: Rpc, reader: jspb.BinaryReader): Rpc;
}

export namespace Rpc {
  export type AsObject = {
    data: Uint8Array | string,
    seqnumber: number,
    cmd: number,
  }
}

export class Auth extends jspb.Message {
  getIdentity(): Uint8Array | string;
  getIdentity_asU8(): Uint8Array;
  getIdentity_asB64(): string;
  setIdentity(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Auth.AsObject;
  static toObject(includeInstance: boolean, msg: Auth): Auth.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Auth, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Auth;
  static deserializeBinaryFromReader(message: Auth, reader: jspb.BinaryReader): Auth;
}

export namespace Auth {
  export type AsObject = {
    identity: Uint8Array | string,
  }
}

export class PublicKey extends jspb.Message {
  getEncodedkey(): Uint8Array | string;
  getEncodedkey_asU8(): Uint8Array;
  getEncodedkey_asB64(): string;
  setEncodedkey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicKey.AsObject;
  static toObject(includeInstance: boolean, msg: PublicKey): PublicKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublicKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicKey;
  static deserializeBinaryFromReader(message: PublicKey, reader: jspb.BinaryReader): PublicKey;
}

export namespace PublicKey {
  export type AsObject = {
    encodedkey: Uint8Array | string,
  }
}

export class Packet extends jspb.Message {
  getIv(): Uint8Array | string;
  getIv_asU8(): Uint8Array;
  getIv_asB64(): string;
  setIv(value: Uint8Array | string): void;

  getAccesskey(): Uint8Array | string;
  getAccesskey_asU8(): Uint8Array;
  getAccesskey_asB64(): string;
  setAccesskey(value: Uint8Array | string): void;

  getMessage(): Uint8Array | string;
  getMessage_asU8(): Uint8Array;
  getMessage_asB64(): string;
  setMessage(value: Uint8Array | string): void;

  getRpc(): Uint8Array | string;
  getRpc_asU8(): Uint8Array;
  getRpc_asB64(): string;
  setRpc(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Packet.AsObject;
  static toObject(includeInstance: boolean, msg: Packet): Packet.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Packet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Packet;
  static deserializeBinaryFromReader(message: Packet, reader: jspb.BinaryReader): Packet;
}

export namespace Packet {
  export type AsObject = {
    iv: Uint8Array | string,
    accesskey: Uint8Array | string,
    message: Uint8Array | string,
    rpc: Uint8Array | string,
  }
}

export class Message extends jspb.Message {
  getSeq(): number;
  setSeq(value: number): void;

  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): void;

  getSender(): number;
  setSender(value: number): void;

  clearPeersList(): void;
  getPeersList(): Array<number>;
  setPeersList(value: Array<number>): void;
  addPeers(value: number, index?: number): number;

  hasDate(): boolean;
  clearDate(): void;
  getDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDate(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getSessionid(): number;
  setSessionid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    seq: number,
    content: Uint8Array | string,
    sender: number,
    peersList: Array<number>,
    date?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    sessionid: number,
  }
}

export interface RequestTypeMap {
  PUBLIC_KEY: 0;
  AUTH: 1;
  PACKET: 2;
  RPC: 3;
}

export const RequestType: RequestTypeMap;

