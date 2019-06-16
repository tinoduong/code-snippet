import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Folder } from 'src/app/shared/globals';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  @Input() folder: Folder;
  @Input() isSelected = false;
  @Input() index: number;

  constructor(private dataSrv: DataService, private ref: ChangeDetectorRef) { }

  ngOnInit() {}

  private toggleEditing() {
    this.dataSrv.toggleFolderEdit(this.index, !this.folder.isEditing);
  }

  onClick() {

    if (this.folder.isEditing) {
      return;
    }

    this.dataSrv.selectFolder(this.index);
  }

  onEdit() {
    this.toggleEditing();
  }

  onKeyUp() {
    this.toggleEditing();
  }
}
