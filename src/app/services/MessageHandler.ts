import {Request} from '../protobuf/MessageStructure_pb';

export class MessageHandler {

  private static instance: MessageHandler;

  private constructor() {
  }

  public static getInstance(): MessageHandler {
    if (!MessageHandler.instance) {
      MessageHandler.instance = new MessageHandler();
    }
    return this.instance;
  }

  public deserializeToPacket(req: Uint8Array) {
    return Request.deserializeBinary(req);
  }

  public serializeToBufferArray(req: Request) {
    if (req == null) {
      console.error('Null Message');
      return null;
    }
    return req.serializeBinary();
  }
}
