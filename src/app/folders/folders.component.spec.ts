import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FoldersComponent } from './folders.component';
import { DataService } from 'src/app/shared/data.service';
import { FolderComponent } from './folder/folder.component';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search/search.component';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatToolbarModule,
  MatRadioModule

} from '@angular/material';


describe('FoldersComponent', () => {
  let component: FoldersComponent;
  let fixture: ComponentFixture<FoldersComponent>;
  let dataSvc;

  class MockDataService extends DataService {
    removeFolder() {
      return;
    }
    addFolder() {
      return;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FoldersComponent,
        FolderComponent,
        SearchComponent
      ],
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

    fixture = TestBed.createComponent(FoldersComponent);

    const folders = [{ id: '000000', isEditing: false, name: 'TEST FOLDER', snippets: [], tags: [] }];
    const selectedFolder = { id: '000000', isEditing: false, name: 'TEST FOLDER', snippets: [], tags: [] };

    component = fixture.componentInstance;
    component.folders = folders;
    component.selectedFolder = selectedFolder;

    dataSvc = TestBed.get(DataService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load with correct amount of folders', () => {

    const folders = [
      { id: '111111', isEditing: false, name: 'New Folder 1', snippets: [], tags: [] },
      { id: '222222', isEditing: true, name: 'New Folder 2', snippets: [], tags: [] }
    ];

    component.folders = folders;
    component.selectedFolder = folders[1];

    component.folders = folders;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.folder-list'));

    expect(el.nativeElement.childElementCount).toEqual(2);
  });

  it('should call add folders on click', () => {

    const folders = [
      { id: '111111', isEditing: false, name: 'New Folder 1', snippets: [], tags: [] },
      { id: '222222', isEditing: true, name: 'New Folder 2', snippets: [], tags: [] }
    ];
    const addFolder = spyOn(dataSvc, 'addFolder');

    component.folders = folders;
    component.selectedFolder = folders[1];

    component.folders = folders;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.add-folder'));
    el.nativeElement.click();

    fixture.detectChanges();

    expect(addFolder).toHaveBeenCalledTimes(1);
  });

  it('should call remove folders on click', () => {

    const folders = [
      { id: '111111', isEditing: false, name: 'New Folder 1', snippets: [], tags: [] },
      { id: '222222', isEditing: true, name: 'New Folder 2', snippets: [], tags: [] }
    ];
    const removeFolder = spyOn(dataSvc, 'removeFolder');

    component.folders = folders;
    component.selectedFolder = folders[1];

    component.folders = folders;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.remove-folder'));
    el.nativeElement.click();

    fixture.detectChanges();

    expect(removeFolder).toHaveBeenCalledTimes(1);
  });

});
