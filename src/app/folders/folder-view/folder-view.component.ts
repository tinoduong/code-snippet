import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Folder, Snippet, Language } from '../../shared/globals';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.scss']
})
export class FolderViewComponent implements OnInit {

  constructor(private dataSvc: DataService) { }

  @Input() folder: Folder = undefined;
  @Input() snippet: Snippet = undefined;

  @Output() snippetNameChange = new EventEmitter<string>();


  displayedColumns: string[] = ['locked', 'name', 'language', 'dateCreated', 'dateModified'];
  languages: Language[] = [];

  onSelect(snippet: Snippet) {
    this.dataSvc.selectSnippet(snippet);
  }

  toggleLock(e: any, i: number) {

    e.stopPropagation();
    this.dataSvc.toggleSnippet(i);
  }

  onAdd() {
    this.dataSvc.addSnippet();
  }

  onRemove() {
    this.dataSvc.removeSnippet(this.snippet.id);
  }

  ngOnInit() {
    const keys = Object.keys(Language).sort();
    keys.forEach(key => this.languages.push(Language[key]));
  }

  updateName(value: string) {
    this.snippetNameChange.emit(value);
  }

  updateLanguage(e: any, i: number) {
    this.dataSvc.updateSnippetLanguage(i, this.snippet.language);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dataSvc.moveSnippets(event.previousIndex, event.currentIndex);
  }

}
