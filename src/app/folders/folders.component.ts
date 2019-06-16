import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Folder } from '../shared/globals';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    /* tslint:disable-next-line */
  selector: 'folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {

  @Input() folders: Folder[];
  @Input() selectedFolder: Folder;

  editingFolderIndex: number;

  constructor(private dataSvc: DataService) { }

  ngOnInit() {
  }

  addFolder() {
    this.dataSvc.addFolder();
  }

  removeFolder() {
    this.dataSvc.removeFolder(this.selectedFolder.id);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dataSvc.moveFolder(event.previousIndex, event.currentIndex);
  }
}
