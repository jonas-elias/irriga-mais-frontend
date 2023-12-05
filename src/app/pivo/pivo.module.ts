import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PivoPageRoutingModule } from './pivo-routing.module';

import { PivoPage } from './pivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PivoPageRoutingModule
  ],
  declarations: [PivoPage]
})
export class PivoPageModule {}
