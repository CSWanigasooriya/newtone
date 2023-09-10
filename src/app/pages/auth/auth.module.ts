import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
})
export class AuthModule {}
