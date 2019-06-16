import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { FoldersModule } from '../folders/folders.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    FoldersModule
  ],
  exports: [
    MainComponent,
  ]
})
export class MainModule { }
