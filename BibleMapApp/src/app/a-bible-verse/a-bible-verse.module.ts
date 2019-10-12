import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ABibleVersePage } from './a-bible-verse.page';

const routes: Routes = [
  {
    path: '',
    component: ABibleVersePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ABibleVersePage]
})
export class ABibleVersePageModule {}
