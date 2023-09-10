import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HomeModule, AuthModule, PagesRoutingModule],
})
export class PagesModule {}
