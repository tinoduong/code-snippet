import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoldersComponent } from './folders.component';
import { FolderComponent } from './folder/folder.component';
import { FolderViewComponent } from './folder-view/folder-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule, MatTableModule, MatRadioModule } from '@angular/material';
import { FileViewComponent } from './file-view/file-view.component';
import { MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [FoldersComponent,
                 FolderComponent,
                 FolderViewComponent,
                 FileViewComponent,
                 SearchComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatRadioModule,
    DragDropModule
  ],
  exports: [
    FoldersComponent,
    FolderViewComponent,
    FileViewComponent,
    SearchComponent
  ]
})
export class FoldersModule { }
