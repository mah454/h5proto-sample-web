import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {H5protoService} from './h5proto.service';

@Injectable({
  providedIn: 'root'
})
export class HandshakeGuard implements CanActivate {

  constructor(private h5protoService: H5protoService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.h5protoService.verified) {
      return true;
    } else {
      /*
      * should redirect to loading component
      * */
      this.router.navigate(['']).then();
      return false;
    }
  }
}
