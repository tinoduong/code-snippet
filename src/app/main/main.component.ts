import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Folder, Snippet, SyntaxTheme } from '../shared/globals';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  oFolders$: Observable<Folder[]>;
  oFolder$: Observable<Folder>;
  oSnippet$: Observable<Snippet>;

  writeToCache = new Subject();

  theme: SyntaxTheme;
  snippet: Snippet;

  constructor(private dataSvc: DataService) { }

  ngOnInit() {

    this.oFolders$ = this.dataSvc.folders$.pipe();
    this.oSnippet$ = this.dataSvc.snippet$.pipe();
    this.oFolder$ = this.dataSvc.folder$.pipe();
    this.theme = this.dataSvc.getTheme();

    this.oSnippet$.subscribe(s => {
      this.snippet = s;
    });

    this.writeToCache
        .pipe(debounceTime(500))
        .subscribe(v => {
          this.dataSvc.writeToLocalStorage();
        });
  }

  onSnippetDataChanged(data: string) {
    this.snippet.data = data;
    this.writeToCache.next();
  }

  onSnippetNameChange(data: string) {
    this.snippet.name = data;
    this.writeToCache.next();
  }

  onThemeChange(data: SyntaxTheme) {
    this.theme = data;
    this.dataSvc.setTheme(data);
    this.writeToCache.next();
  }
}
