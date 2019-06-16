import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FolderComponent } from './folder.component';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatRadioModule

} from '@angular/material';
import { By } from '@angular/platform-browser';

describe('FolderComponent', () => {

  let component: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;
  let injectedDataService;

  class MockDataService extends DataService {
    toggleFolderEdit(i: number, isediting: boolean) {
      return;
    }
    selectFolder(i: number) {
      return;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderComponent],
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

    fixture = TestBed.createComponent(FolderComponent);

    const folder = {
      id: '000000',
      isEditing: false,
      name: 'TEST FOLDER',
      snippets: [],
      tags: [],
      isHidden: false
    };

    component = fixture.componentInstance;
    component.folder = folder;
    injectedDataService = TestBed.get(DataService);
    fixture.detectChanges();
  });

  it('should create the folder component', (() => {
    const c = component;
    expect(c).toBeTruthy();
  }));

  describe('Folder Edit', () => {
    it('edit = true', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      component.folder = folder;

      fixture.detectChanges();
      return fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.editing')).toBeTruthy();
        expect(compiled.querySelector('input').value).toEqual(folder.name);
      });

    });

    it('should render as non-edit mode', () => {

      const folder = {
        id: '111111',
        isEditing: false,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      component.folder = folder;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.folder-name').textContent).toEqual(folder.name);

    });

    it('should render as hidden', () => {

      const folder = {
        id: '111111',
        isEditing: false,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: true
      };

      component.folder = folder;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.hidden')).toBeTruthy();

    });

    it('should render as visible', () => {

      const folder = {
        id: '111111',
        isEditing: false,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      component.folder = folder;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.hidden')).toBeFalsy();

    });

    it('onClick icon', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      const toggleFolderEdit = spyOn(injectedDataService, 'toggleFolderEdit');
      component.folder = folder;

      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.folder-edit-icon'));
      el.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(toggleFolderEdit).toHaveBeenCalledTimes(1);

    });

    it('onKeyup input', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      const toggleFolderEdit = spyOn(injectedDataService, 'toggleFolderEdit');
      component.folder = folder;

      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.input input'));
      el.triggerEventHandler('keyup.enter', null);

      fixture.detectChanges();
      expect(toggleFolderEdit).toHaveBeenCalledTimes(1);

    });

  });

  describe('Folder Select', () => {
    it('isSelected = true', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      component.folder = folder;
      component.isSelected = true;
      component.index = 0;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.selected')).toBeTruthy();
      expect(compiled.querySelector('mat-icon').textContent).toEqual('folder_open');

    });

    it('isSelected = false', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      component.folder = folder;
      component.isSelected = false;
      component.index = 0;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.selected')).toBeFalsy();
      expect(compiled.querySelector('mat-icon').textContent).toEqual('folder');
    });

    it('onclick triggers selection', () => {

      const folder = {
        id: '111111',
        isEditing: false,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      const selectFolder = spyOn(injectedDataService, 'selectFolder');
      component.folder = folder;
      component.isSelected = false;

      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.folder'));
      el.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(selectFolder).toHaveBeenCalledTimes(1);
    });

    it('onclick does not selection when already editing', () => {

      const folder = {
        id: '111111',
        isEditing: true,
        name: 'New Folder',
        snippets: [],
        tags: [],
        isHidden: false
      };

      const selectFolder = spyOn(injectedDataService, 'selectFolder');
      component.folder = folder;
      component.isSelected = false;

      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.folder'));
      el.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(selectFolder).toHaveBeenCalledTimes(0);
    });

  });

  // it('on hover actions', () => {
  //   const folder = {
  //     id: '111111',
  //     isEditing: false,
  //     name: 'New Folder',
  //     snippets: [],
  //     tags: []
  //   };

  //   const selectFolder = spyOn(injectedDataService, 'selectFolder');
  //   const mouseenter = new MouseEvent('mouseenter');
  //   component.folder = folder;
  //   component.isSelected = false;

  //   fixture.detectChanges();

  //   const el = fixture.debugElement.query(By.css('.folder'));
  //   const compiled = fixture.debugElement.nativeElement;


  //   expect(compiled.querySelector('mat-icon')).toBeFalsy();
  //   expect(fixture.debugElement.query(By.css('.folder-edit-icon'))).toBeUndefined();

  //   // el.nativeElement.dispatchEvent(mouseenter);
  //   // fixture.detectChanges();
  //   // expect(fixture.debugElement.query(By.css('.folder-edit-icon'))).toBeTruthy();

  // });


});
