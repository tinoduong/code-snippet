import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileViewComponent } from './file-view.component';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Folder, Snippet, SyntaxTheme, Language } from '../../shared/globals';

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
  toggleFolderEdit(i: number, isediting: boolean) {
    return;
  }
  selectFolder(i: number) {
    return;
  }
}

describe('FileViewComponent', () => {
  let component: FileViewComponent;
  let fixture: ComponentFixture<FileViewComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewComponent],
      providers: [{ provide: DataService, useClass: MockDataService }],
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

    fixture = TestBed.createComponent(FileViewComponent);

    const snippet = {
      id: 'AAAAAAB',
      data: 'Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: Language.javascript,
      locked: false,
      isHidden: false
    };

    component = fixture.componentInstance;
    component.snippet = snippet;
    component.theme = SyntaxTheme.light;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('constructor', () => {

    const setReadOnly = spyOn(component.editor, 'setReadOnly');
    const loadEditor = spyOn(component, 'loadEditor');

    component.ngAfterViewInit();

    expect(component.editor).toBeTruthy();
    expect(component.ace).toBeTruthy();
    expect(loadEditor).toHaveBeenCalledTimes(1);

    expect(setReadOnly).toHaveBeenCalledTimes(1);
  });

  describe('load editor', () => {

    it('happy path', () => {

      const setValue = spyOn(component.editor, 'setValue');
      const setTheme = spyOn(component.editor, 'setTheme');
      const setMode = spyOn(component.editor.session, 'setMode');
      const navigateTo = spyOn(component.editor, 'navigateTo');

      component.loadEditor();

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setTheme).toHaveBeenCalledTimes(1);
      expect(setMode).toHaveBeenCalledTimes(1);
      expect(navigateTo).toHaveBeenCalledTimes(1);
    });

    it('missing ace', () => {

      component.ace = null;
      const setValue = spyOn(component.editor, 'setValue');
      const setTheme = spyOn(component.editor, 'setTheme');
      const setMode = spyOn(component.editor.session, 'setMode');
      const navigateTo = spyOn(component.editor, 'navigateTo');

      component.loadEditor();

      expect(setValue).toHaveBeenCalledTimes(0);
      expect(setTheme).toHaveBeenCalledTimes(0);
      expect(setMode).toHaveBeenCalledTimes(0);
      expect(navigateTo).toHaveBeenCalledTimes(0);

    });

    it('missing snippet', () => {

      component.snippet = null;
      const setValue = spyOn(component.editor, 'setValue');
      const setTheme = spyOn(component.editor, 'setTheme');
      const setMode = spyOn(component.editor.session, 'setMode');
      const navigateTo = spyOn(component.editor, 'navigateTo');

      component.loadEditor();

      expect(setValue).toHaveBeenCalledWith('');
      expect(setTheme).toHaveBeenCalledTimes(0);
      expect(setMode).toHaveBeenCalledTimes(0);
      expect(navigateTo).toHaveBeenCalledTimes(0);

    });

  });

  describe('Theme controls', () => {

    it('light theme is checked', () => {

      component.theme = SyntaxTheme.light;
      fixture.detectChanges();

      const light = fixture.debugElement.query(By.css('.light'));
      const dark = fixture.debugElement.query(By.css('.dark'));

      expect(dark.attributes['ng-reflect-checked']).toBe('false');
      expect(light.attributes['ng-reflect-checked']).toBe('true');

    });

    it('dark theme is checked', () => {

      component.theme = SyntaxTheme.dark;
      fixture.detectChanges();

      const light = fixture.debugElement.query(By.css('.light'));
      const dark = fixture.debugElement.query(By.css('.dark'));

      expect(dark.attributes['ng-reflect-checked']).toBe('true');
      expect(light.attributes['ng-reflect-checked']).toBe('false');

    });

    it('trigger change', () => {

      const radio = fixture.debugElement.query(By.css('mat-radio-group'));
      const emit = spyOn(component.themeChange, 'emit');

      radio.triggerEventHandler('change', {value: SyntaxTheme.dark});

      fixture.detectChanges();

      expect(emit).toHaveBeenCalledWith(SyntaxTheme.dark);
    });

  });

  describe('on changes', () => {

    it('happy path', () => {

      const loadEditor = spyOn(component, 'loadEditor');
      const setReadOnly = spyOn(component.editor, 'setReadOnly');

      component.ngOnChanges();

      expect(loadEditor).toHaveBeenCalledTimes(1);
      expect(setReadOnly).toHaveBeenCalledTimes(1);
    });

    it('no editor', () => {

      const loadEditor = spyOn(component, 'loadEditor');
      const setReadOnly = spyOn(component.editor, 'setReadOnly');

      component.editor = null;

      component.ngOnChanges();

      expect(loadEditor).toHaveBeenCalledTimes(1);
      expect(setReadOnly).toHaveBeenCalledTimes(0);

    });

    it('no snippet', () => {
      const loadEditor = spyOn(component, 'loadEditor');
      const setReadOnly = spyOn(component.editor, 'setReadOnly');

      component.snippet = null;

      component.ngOnChanges();

      expect(loadEditor).toHaveBeenCalledTimes(1);
      expect(setReadOnly).toHaveBeenCalledTimes(0);

    });

  });

  describe('editor change event', () => {

    describe('keyUp event', () => {

      it('happy path should trigger emit', () => {

        const emit = spyOn(component.snippetDataChange, 'emit');
        const el = fixture.nativeElement.querySelector('#file-content');
        const event = new Event('keyup');
        el.dispatchEvent(event);

        expect(emit).toHaveBeenCalledTimes(1);
      });

      it('missing snippet should not trigger', () => {

        const emit = spyOn(component.snippetDataChange, 'emit');
        const el = fixture.nativeElement.querySelector('#file-content');
        const event = new Event('keyup');
        component.snippet = null;

        el.dispatchEvent(event);

        expect(emit).toHaveBeenCalledTimes(0);
      });

    });

    describe('paste event', () => {

      it('happy path should trigger emit', () => {

        const emit = spyOn(component.snippetDataChange, 'emit');
        const el = fixture.nativeElement.querySelector('#file-content');
        const event = new Event('paste');
        el.dispatchEvent(event);

        expect(emit).toHaveBeenCalledTimes(1);
      });

      it('missing snippet should not trigger', () => {

        const emit = spyOn(component.snippetDataChange, 'emit');
        const el = fixture.nativeElement.querySelector('#file-content');
        const event = new Event('paste');
        component.snippet = null;

        el.dispatchEvent(event);

        expect(emit).toHaveBeenCalledTimes(0);
      });

    });

  });


});
