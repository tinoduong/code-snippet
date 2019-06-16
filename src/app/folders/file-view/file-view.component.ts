import { Component, OnInit, OnChanges, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { Snippet, SyntaxTheme } from '../../shared/globals';


@Component({
  selector: 'file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() snippet: Snippet = undefined;
  @Input() theme: SyntaxTheme = SyntaxTheme.light;

  @Output() snippetDataChange = new EventEmitter<string>();
  @Output() themeChange = new EventEmitter<SyntaxTheme>();

  editor: any;
  ace: any;
  themes = SyntaxTheme;

  constructor(private dataSvc: DataService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.ace = this.ace || (window as any).ace;
    this.editor = this.editor || this.ace.edit('editor');

    if (this.snippet) {
      this.editor.setReadOnly(this.snippet.locked);
    }

    this.loadEditor();
  }

  editorChange() {

      if (!this.snippet) { return; }

      this.snippetDataChange.emit(this.editor.getValue());
  }

  ngOnChanges() {

    if (this.editor && this.snippet) {
      this.editor.setReadOnly(this.snippet.locked);
    }

    this.loadEditor();
  }

  onThemeChange(e: any) {
    this.themeChange.emit(e.value);
  }

  loadEditor() {

    if (!this.ace) { return; }
    if (!this.snippet) {
      this.editor.setValue('');
      return;
    }

    try {

      this.editor.setValue(this.snippet.data);
      this.editor.setTheme(`ace/theme/${this.theme}`);
      this.editor.session.setMode(`ace/mode/${this.snippet.language}`);
      this.editor.navigateTo(0, 0);

    } catch (e) {
      console.log(e);
    }

  }

}
