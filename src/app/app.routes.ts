import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth/callback',
    redirectTo: 'user'
  },
  {
    path: 'signedout',
    component: SignedOutComponent
  },
  {
    path: '**',
    redirectTo: '/'
  },
];
