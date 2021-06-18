import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule, InputTextModule, PanelModule, ProgressSpinnerModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {H5protoService} from './services/h5proto.service';
import {WebSocketService} from './services/web-socket.service';
import {HighFiveComponent} from './components/handshake/high-five.component';
import {PanelComponent} from './components/panel/panel.component';
import {LoadingComponent} from './components/loading/loading.component';
import {TopbarComponent} from './components/panel/topbar/topbar.component';
import {ConnectionStateComponent} from './components/connection-state/connection-state.component';

@NgModule({
  declarations: [
    AppComponent,
    HighFiveComponent,
    PanelComponent,
    LoadingComponent,
    TopbarComponent,
    ConnectionStateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    PanelModule
  ],
  providers: [H5protoService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
