import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PivoPage } from './pivo.page';

const routes: Routes = [
  {
    path: '',
    component: PivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PivoPageRoutingModule {}
