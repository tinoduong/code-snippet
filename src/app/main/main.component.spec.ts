import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { DataService } from '../shared/data.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Folder, Snippet, SyntaxTheme, Language } from '../shared/globals';

import { SearchComponent } from '../folders/search/search.component';
import { FolderComponent } from '../folders/folder/folder.component';
import { FolderViewComponent } from '../folders/folder-view/folder-view.component';
import { FoldersComponent } from '../folders/folders.component';
import { FileViewComponent } from '../folders/file-view/file-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatRadioModule

} from '@angular/material';

class MockDataService extends DataService {

  fakeFolders = new BehaviorSubject<Folder[]>(undefined);
  folders$: Observable<Folder[]> = this.fakeFolders.asObservable();

  fakeFolder = new BehaviorSubject<Folder>(undefined);
  folder$: Observable<Folder> = this.fakeFolder.asObservable();

  fakeSnippet = new BehaviorSubject<Snippet>(undefined);
  snippet$: Observable<Snippet> = this.fakeSnippet.asObservable();

  writeToLocalStorage() {
    return;
  }

  getTheme() {
    return SyntaxTheme.light;
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let dataSvc: MockDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        FolderComponent,
        FolderViewComponent,
        FoldersComponent,
        FileViewComponent,
        SearchComponent
      ],
      providers: [
        { provide: DataService, useClass: MockDataService }
      ],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatToolbarModule,
        MatRadioModule,
        FormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);

    const s = {
      id: 'AAAAAAB',
      data: 'Snippet Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: Language.javascript,
      locked: false
    };

    const fs = [{ id: '000000', isEditing: false, name: 'Folder', snippets: [s], tags: [] }];

    dataSvc = TestBed.get(DataService);
    dataSvc.fakeFolders.next(fs);
    dataSvc.fakeFolder.next(fs[0]);
    dataSvc.fakeSnippet.next(s);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test snipped name change', fakeAsync(() => {

    const fakeSnippetUpdate = 'Hello world Fake Snippet Data';
    const writeToLocalStorage = spyOn(dataSvc, 'writeToLocalStorage');

    const folderView = fixture.debugElement.query(By.directive(FolderViewComponent));
    const oldDate = component.snippet.dateModified;
    folderView.componentInstance.snippetNameChange.emit(fakeSnippetUpdate);

    tick(600);
    fixture.detectChanges();

    expect(component.snippet.name).toEqual(fakeSnippetUpdate);
    expect(oldDate).not.toBe(component.snippet.dateModified);
    expect(writeToLocalStorage).toHaveBeenCalledTimes(1);

  }));

  it('should test theme change', fakeAsync(() => {

    const themeChanged = SyntaxTheme.dark;
    const writeToLocalStorage = spyOn(dataSvc, 'writeToLocalStorage');

    const fileView = fixture.debugElement.query(By.directive(FileViewComponent));
    fileView.componentInstance.themeChange.emit(themeChanged);

    tick(600);
    fixture.detectChanges();

    expect(component.theme).toEqual(themeChanged);
    expect(writeToLocalStorage).toHaveBeenCalledTimes(1);
  }));

  it('should test snippet data change', fakeAsync(() => {

    const dataChanged = 'New Snippet data';
    const writeToLocalStorage = spyOn(dataSvc, 'writeToLocalStorage');
    const oldDate = component.snippet.dateModified;

    const fileView = fixture.debugElement.query(By.directive(FileViewComponent));
    fileView.componentInstance.snippetDataChange.emit(dataChanged);
    tick(600);
    fixture.detectChanges();

    expect(component.snippet.data).toEqual(dataChanged);
    expect(oldDate).not.toBe(component.snippet.dateModified);

    expect(writeToLocalStorage).toHaveBeenCalledTimes(1);

  }));

});
