import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HighFiveComponent} from './components/handshake/high-five.component';
import {PanelComponent} from './components/panel/panel.component';
import {HandshakeGuard} from './services/handshake.guard';
import {LoadingComponent} from './components/loading/loading.component';


const routes: Routes = [
  {path: '', component: LoadingComponent},
  {path: 'highfive', component: HighFiveComponent},
  {path: 'panel', component: PanelComponent, canActivate: [HandshakeGuard]},
  {path: '**', redirectTo: '/panel', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
