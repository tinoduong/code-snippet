import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FolderViewComponent } from './folder-view.component';
import { DataService } from 'src/app/shared/data.service';
import { Folder, Snippet, SyntaxTheme, Language } from '../../shared/globals';
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
  addSnippet() {
    return;
  }

  removeSnippet() {
    return;
  }

  updateSnippetLanguage(x, y) {
    return;
  }

  toggleSnippet(i) {
    return;
  }

  selectSnippet() {
    return;
  }
}

describe('FolderViewComponent', () => {
  let component: FolderViewComponent;
  let fixture: ComponentFixture<FolderViewComponent>;
  let dataSvc;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderViewComponent ],
      providers: [{ provide: DataService, useClass: MockDataService }],
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatToolbarModule,
        MatRadioModule,
        BrowserAnimationsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    const s1 = {
      id: 'AAAAAAA',
      data: 'Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: Language.javascript,
      locked: false,
      isHidden: false
    };
    const s2 = Object.assign({}, s1, { id: 'BBBBBBB', language: Language.python});
    const s3 = Object.assign({}, s1, { id: 'CCCCCCC', locked: true, language: Language.scala});
    const folder = { id: '000000', isEditing: false, name: 'Folder', snippets: [s1, s2, s3], tags: [], isHidden: false };

    fixture = TestBed.createComponent(FolderViewComponent);
    dataSvc = TestBed.get(DataService);

    component = fixture.componentInstance;
    component.folder = folder;
    component.snippet = s2;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table', () => {

    it('should render hidden properly', () => {
      const s1 = {
        id: 'AAAAAAA',
        data: 'Data',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: Language.javascript,
        locked: false,
        isHidden: true
      };
      const folder = { id: '000000', isEditing: false, name: 'Folder', snippets: [s1], tags: [], isHidden: false };
      component.folder = folder;
      component.snippet = null;

      fixture.detectChanges();
      const el = fixture.debugElement.nativeElement.querySelector('.hidden');
      expect(el).toBeTruthy();
    });

    it('should render visible properly', () => {
      const s1 = {
        id: 'AAAAAAA',
        data: 'Data',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: Language.javascript,
        locked: false,
        isHidden: false
      };
      const folder = { id: '000000', isEditing: false, name: 'Folder', snippets: [s1], tags: [], isHidden: false };
      component.folder = folder;
      component.snippet = null;

      fixture.detectChanges();
      const el = fixture.debugElement.nativeElement.querySelector('.hidden');
      expect(el).toBeFalsy();
    });

    it('should render 3 snippets', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelectorAll('.table-row');
      expect(el.length).toBe(3);
    });

    it('should trigger row selection if clicked', () => {

      const el = fixture.nativeElement.querySelectorAll('.table-row');
      const selectSnippet = spyOn(dataSvc, 'selectSnippet');

      el[1].click();
      fixture.detectChanges();

      expect(selectSnippet).toHaveBeenCalledTimes(1);
    });

    it('should have second row selected', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelectorAll('.table-row');
      expect(Object.values(el[1].classList).indexOf('selected')).toBeGreaterThan(-1);
    });

    it('should have third row locked', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelectorAll('.table-row');
      const lock = el[2].querySelector('.lock-icon');
      expect(lock.textContent).toContain('lock');
    });

    it('should have first and second row unlocked', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelectorAll('.table-row');

      expect(el[0].querySelector('.lock-icon').textContent).toContain('lock_open');
      expect(el[1].querySelector('.lock-icon').textContent).toContain('lock_open');
    });

    it('should have language set properly', () => {

      fixture.detectChanges();
      const el = fixture.nativeElement.querySelectorAll('.language-options');

      expect(el[0].value).toBe(Language.javascript);
      expect(el[1].value).toBe(Language.python);
      expect(el[2].value).toBe(Language.scala);
    });

    it('should toggle when icon lock is clicked', () => {

      const el = fixture.nativeElement.querySelector('.mat-icon');
      const toggleSnippet = spyOn(dataSvc, 'toggleSnippet');
      el.click();

      expect(toggleSnippet).toHaveBeenCalledTimes(1);
    });

    it('should toggle when change snippet selection when select box is updated', () => {

      const el = fixture.nativeElement.querySelectorAll('.language-options');
      const updateSnippetLanguage = spyOn(dataSvc, 'updateSnippetLanguage');
      const event = new Event('change');
      el[1].dispatchEvent(event);
      fixture.detectChanges();

      expect(updateSnippetLanguage).toHaveBeenCalledTimes(1);
    });

    it('should update name when keyup', () => {

      const el = fixture.nativeElement.querySelectorAll('.snippet-name');
      const emit = spyOn(component.snippetNameChange, 'emit');
      const event = new Event('keyup');

      el[1].dispatchEvent(event);
      fixture.detectChanges();
      expect(emit).toHaveBeenCalledTimes(1);
    });

  });

  describe('update snippet list', () => {
    it('should call add new snippet', () => {
      const el = fixture.debugElement.queryAll(By.css('.tool-bar mat-icon'));
      const addSnippet = spyOn(dataSvc, 'addSnippet');

      el[0].nativeElement.click();

      fixture.detectChanges();

      expect(addSnippet).toHaveBeenCalledTimes(1);
    });

    it('should call remove snippet', () => {
      const el = fixture.debugElement.queryAll(By.css('.tool-bar mat-icon'));
      const removeSnippet = spyOn(dataSvc, 'removeSnippet');

      el[1].nativeElement.click();

      fixture.detectChanges();

      expect(removeSnippet).toHaveBeenCalledTimes(1);
    });

  });


});
