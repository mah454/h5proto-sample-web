import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Request} from '../protobuf/MessageStructure_pb';

@Injectable({
  providedIn: 'root'
})
export class ObserverService {

  requestSubject = new Subject<Request>();
  connection = new Subject<boolean>();
  activationKey = new Subject<boolean>();

  constructor() {
  }
}
