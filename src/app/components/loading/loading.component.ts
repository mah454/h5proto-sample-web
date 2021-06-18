import {Component} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  constructor(private api: ApiService) {
    api.checkCurrentConnectionStatus();
  }
}
