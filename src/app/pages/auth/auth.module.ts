import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, AuthComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'sign-in', component: SignInComponent },
          { path: 'sign-up', component: SignUpComponent },
          { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
        ],
      },
    ]),
    CommonModule,
    SharedModule,
  ],
})
export class AuthModule {}
