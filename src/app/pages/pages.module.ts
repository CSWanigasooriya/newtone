import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [AboutComponent, ContactComponent],
  imports: [CommonModule, HomeModule, PagesRoutingModule],
})
export class PagesModule {}
