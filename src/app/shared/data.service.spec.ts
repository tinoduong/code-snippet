
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DataService } from './data.service';
import { take, first } from 'rxjs/operators';
import { Language, SyntaxTheme, Snippet, Folder } from '../shared/globals';
import { write } from 'fs';

describe('DataService', () => {

  const DATA_KEY = 'CodeCollectorData';
  let service: DataService;

  function writeToStore(folders) {
    const store = {
      theme: SyntaxTheme.light,
      version: '0.0.0.',
      folders
    };

    window.localStorage.setItem(DATA_KEY, JSON.stringify(store));
  }

  function fetchFromStore() {

    const store = service.readFromLocalStorage();

    if (!store) { return null; }

    return store.folders;
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [DataService]
    });

    writeToStore('');
  });

  it('Service should be defined', () => {
    service = TestBed.get(DataService);
    expect(service).toBeDefined();
  });

  it('Should read/write data to local storage', () => {

    service = TestBed.get(DataService);

    const value1 = fetchFromStore();
    expect(value1).toBeFalsy();

    service.writeToLocalStorage();
    const value2 = fetchFromStore();
    expect(value2).toBeTruthy();
    expect(value2.length).toBe(1);
    expect(value2[0].name).toBe('New Folder');
  });

  describe('constructor', () => {

    it('Should return folders', done => {

      const data = [
        { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);

      service.folders$.subscribe(folders => {
        expect(folders.length).toBe(2);
        expect(folders[0].id).toBe('000000');
        expect(folders[1].id).toBe('111111');
        done();
      });

    });

    it('Should return folder', done => {

      const data = [
        { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);

      service.folder$.subscribe(folder => {

        expect(folder).toBeDefined();
        expect(folder.id).toBe('000000');
        done();
      });

    });

    it('Should return snippet', done => {

      const snippet = {
        id: 'AAAAAA',
        data: 'Data',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: 'javascript',
        locked: false
      };
      const data = [
        { id: '000000', isEditing: false, name: 'Folder', snippets: [snippet], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);

      service.snippet$.subscribe(s => {

        expect(s).toBeDefined();
        expect(s.id).toBe('AAAAAA');
        done();

      });

    });

  });

  describe('Select Folder', () => {
    it('with snippets ', done => {

      const snippet = {
        id: 'AAAAAA',
        data: 'Data',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: 'javascript',
        locked: false
      };
      const data = [
        { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder', snippets: [snippet], tags: [], isHidden: false },
        { id: '222222', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);
      const turnOffEdit = jest.spyOn(service, 'turnOffEdit');

      service.selectFolder(1);
      expect(turnOffEdit).toHaveBeenCalledTimes(1);

      service.folder$.subscribe(folder => {
        expect(folder).toBeDefined();
        expect(folder.id).toBe('111111');
        done();
      });

    });

    it('without snippets ', done => {

      const data = [
        { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
        { id: '222222', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);
      const turnOffEdit = jest.spyOn(service, 'turnOffEdit');

      service.selectFolder(2);
      expect(turnOffEdit).toHaveBeenCalledTimes(1);

      service.folder$.subscribe(folder => {
        expect(folder).toBeDefined();
        expect(folder.id).toBe('222222');
        done();
      });

    });

  });

  it('Add folder', done => {

    const data = [{ id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }];
    writeToStore(data);

    service = TestBed.get(DataService);
    const selectFolder = jest.spyOn(service, 'selectFolder');
    const writeToLocalStorage = jest.spyOn(service, 'writeToLocalStorage');

    service.addFolder();
    expect(selectFolder).toHaveBeenCalledTimes(1);
    expect(writeToLocalStorage).toHaveBeenCalledTimes(1);

    service.folders$.subscribe(folders => {
      expect(folders.length).toBe(2);
      expect(folders[0].id).toBe('000000');
      done();
    });

  });

  it('Toggle Folder Edit', done => {

    const data = [
      { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
      { id: '111111', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
      { id: '222222', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
    ];

    writeToStore(data);

    service = TestBed.get(DataService);

    const p1 = new Promise((resolve, reject) => {

      service.folders$
        .pipe(take(1))
        .subscribe({
          next: f => {
            expect(f.length).toBe(3);
            expect(f[0].isEditing).toBe(false);
            expect(f[1].isEditing).toBe(false);
            expect(f[2].isEditing).toBe(false);
          },
          complete: resolve,
          error: reject
        });
    });

    p1.then(() => {

      service.toggleFolderEdit(1, true);

      service.folder$
        .pipe(take(1))
        .subscribe({
          next: f => {
            expect(f.isEditing).toBe(true);
          },
          complete: done
        });

    });

  });

  it('Add Snippet', done => {

    const data = [
      { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
    ];
    let cFolder;

    writeToStore(data);
    service = TestBed.get(DataService);
    const selectSnippet = spyOn(service, 'selectSnippet');
    const writeToLocalStorage = spyOn(service, 'writeToLocalStorage');

    const p1 = new Promise((resolve, reject) => {
      service.folder$.subscribe(folder => {
        cFolder = folder;
        expect(folder.snippets.length).toBe(0);

        resolve();
      });
    });

    service.addSnippet();
    expect(selectSnippet).toHaveBeenCalledTimes(1);
    expect(writeToLocalStorage).toHaveBeenCalledTimes(1);

    p1.then(() => {

      expect(cFolder.snippets.length).toBe(1);
      done();
    });

  });

  it('Toggle Snippet', done => {

    const snippet = {
      id: 'AAAAAAB',
      data: 'Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: 'javascript',
      locked: false,
      isHidden: false
    };
    const data = [{ id: '000000', isEditing: false, name: 'Folder', snippets: [snippet], tags: [], isHidden: false }];

    writeToStore(data);
    service = TestBed.get(DataService);
    const writeToLocalStorage = spyOn(service, 'writeToLocalStorage');

    const p1 = service.snippet$.pipe(first()).toPromise();
    const p2 = service.folder$.pipe(first()).toPromise();

    Promise.all([p1, p2]).then(values => {

      const s = values[0];
      const f = values[1];

      expect(s.locked).toBe(false);
      expect(f.snippets[0].locked).toBe(false);
      expect(writeToLocalStorage).toHaveBeenCalledTimes(0);

      return Promise.resolve();

    }).then(() => {

      service.toggleSnippet(0);

      const p4 = service.snippet$.pipe(first()).toPromise();
      const p5 = service.folder$.pipe(first()).toPromise();

      Promise.all([p4, p5]).then(values => {
        const s = values[0];
        const f = values[1];
        expect(s.locked).toBe(true);
        expect(f.snippets[0].locked).toBe(true);
        expect(writeToLocalStorage).toHaveBeenCalledTimes(1);

        done();
      });
    });

  });

  it('Update Snippet Language', done => {

    const snippet = {
      id: 'AAAAAAB',
      data: 'Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: 'javascript',
      locked: false,
      isHidden: false
    };
    const data = [
      { id: '000000', isEditing: false, name: 'Folder', snippets: [snippet], tags: [], isHidden: false }
    ];

    writeToStore(data);
    service = TestBed.get(DataService);
    const writeToLocalStorage = spyOn(service, 'writeToLocalStorage');

    const p1 = service.snippet$.pipe(first()).toPromise();
    const p2 = service.folder$.pipe(first()).toPromise();

    Promise.all([p1, p2]).then(values => {

      const s = values[0];
      const f = values[1];

      expect(s.language).toBe('javascript');
      expect(f.snippets[0].language).toBe('javascript');
      expect(writeToLocalStorage).toHaveBeenCalledTimes(0);

      return Promise.resolve();
    }).then(() => {

      service.updateSnippetLanguage(0, Language.typescript);
      const p3 = service.snippet$.pipe(first()).toPromise();
      const p4 = service.folder$.pipe(first()).toPromise();

      Promise.all([p3, p4]).then(values => {
        const s = values[0];
        const f = values[1];
        expect(s.language).toBe('typescript');
        expect(f.snippets[0].language).toBe('typescript');
        expect(writeToLocalStorage).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  it('Remove Folder', done => {

    const data = [
      { id: '000000', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
      { id: '111111', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false },
      { id: '222222', isEditing: false, name: 'Folder', snippets: [], tags: [], isHidden: false }
    ];

    const toDelete = '111111';

    writeToStore(data);
    service = TestBed.get(DataService);
    const writeToLocalStorage = spyOn(service, 'writeToLocalStorage');

    service.removeFolder(toDelete);
    const pp1 = service.folders$.pipe(first()).toPromise();
    pp1.then(fs => {
      expect(fs.length).toBe(2);
      expect(fs[0].id).toBe('000000');
      expect(fs[1].id).toBe('222222');
      expect(fs.filter(f => f.id === toDelete).length).toBe(0);
      expect(writeToLocalStorage).toHaveBeenCalledTimes(1);
      done();
    });

  });

  it('Remove Snippet', done => {

    const baseSnippet = {
      id: 'AAAAAA',
      data: 'Data',
      name: 'Name',
      dateCreated: new Date(),
      dateModified: new Date(),
      language: 'javascript',
      locked: false,
      isHidden: false
    };
    const sn1 = Object.assign({}, baseSnippet, { id: 'AAAAAA' });
    const sn2 = Object.assign({}, baseSnippet, { id: 'BBBBBB' });
    const sn3 = Object.assign({}, baseSnippet, { id: 'CCCCCC' });
    const data = [{ id: '000000', isEditing: false, name: 'Folder', snippets: [sn1, sn2, sn3], tags: [], isHidden: false }];
    const toDelete = 'BBBBBB';

    writeToStore(data);
    service = TestBed.get(DataService);
    const writeToLocalStorage = spyOn(service, 'writeToLocalStorage');

    service.removeSnippet(toDelete);
    const pp2 = service.folder$.pipe(first()).toPromise();
    pp2.then(f => {
      expect(f.snippets.length).toBe(2);
      expect(f.snippets[0].id).toBe('AAAAAA');
      expect(f.snippets[1].id).toBe('CCCCCC');
      expect(f.snippets.filter(s => s.id === toDelete).length).toBe(0);
      expect(writeToLocalStorage).toHaveBeenCalledTimes(1);
      done();
    });

  });

  describe('updateSearchFilter', () => {

    let s1: Snippet;
    let s2: Snippet;
    let s3: Snippet;
    let s4: Snippet;
    let s5: Snippet;
    let s6: Snippet;
    let s7: Snippet;
    let f1: Folder[];

    beforeEach(() => {

      s1 = {
        id: 'AAAAAA',
        data: 'a hello good bye',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: Language.python,
        locked: false,
        isHidden: false
      };

      s2 = Object.assign({}, s1, { id: 'BBBBBB', data: 'a good bear' });
      s3 = Object.assign({}, s1, { id: 'CCCCCC', data: 'a bye bear' });
      s4 = Object.assign({}, s1, { id: 'EEEEEE', data: 'a hello' });
      s5 = Object.assign({}, s1, { id: 'FFFFFF', data: 'a bat fox' });
      s6 = Object.assign({}, s1, { id: 'GGGGGG', data: 'a fox' });
      s7 = Object.assign({}, s1, { id: 'GGGGGG', data: 'a bear' });

      f1 = [
        { id: '000000', isEditing: false, name: 'Folder 1', snippets: [s1, s2, s3], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder 2', snippets: [s4, s5, s6], tags: [], isHidden: false },
        { id: '222222', isEditing: false, name: 'Folder 3', snippets: [s7], tags: [], isHidden: false }
      ];

      writeToStore(f1);
    });

    describe('Mark isHidden correctly', () => {
      it('should mark all as hidden', () => {

        service = TestBed.get(DataService);
        service.updateSearchFilter('DOES NOT EXISTS');
        service.writeToLocalStorage();
        const { folders } = service.readFromLocalStorage();

        folders.forEach(f => {
          expect(f.isHidden).toBe(true);

          f.snippets.forEach(s => {
            expect(s.isHidden).toBe(true);
          });

        });

      });

      it('should mark all as visible', () => {

        service = TestBed.get(DataService);
        service.updateSearchFilter('a');
        service.writeToLocalStorage();
        const { folders } = service.readFromLocalStorage();

        folders.forEach(f => {
          expect(f.isHidden).toBe(false);

          f.snippets.forEach(s => {
            expect(s.isHidden).toBe(false);
          });

        });

      });

      it('should mark correctly across multiple snippets and multiple folders', () => {

        service = TestBed.get(DataService);
        service.updateSearchFilter('bear');
        service.writeToLocalStorage();
        const { folders } = service.readFromLocalStorage();

        expect(folders[0].isHidden).toBe(false);
        expect(folders[1].isHidden).toBe(true);
        expect(folders[2].isHidden).toBe(false);

        expect(folders[0].snippets[0].isHidden).toBe(true);
        expect(folders[0].snippets[1].isHidden).toBe(false);
        expect(folders[0].snippets[2].isHidden).toBe(false);

        expect(folders[1].snippets[0].isHidden).toBe(true);
        expect(folders[1].snippets[1].isHidden).toBe(true);
        expect(folders[1].snippets[2].isHidden).toBe(true);

        expect(folders[2].snippets[0].isHidden).toBe(false);
      });

      it('should clear hidden if seaching empty string', () => {
        const ss1 = {
          id: 'AAAAAA',
          data: 'a hello good bye',
          name: 'Name',
          dateCreated: new Date(),
          dateModified: new Date(),
          language: Language.python,
          locked: false,
          isHidden: true
        };
        const ff1 = [{ id: '000000', isEditing: false, name: 'Folder 1', snippets: [ss1], tags: [], isHidden: true }];
        writeToStore(ff1);
        service = TestBed.get(DataService);
        service.updateSearchFilter('');
        service.writeToLocalStorage();
        const { folders } = service.readFromLocalStorage();

        expect(folders[0].isHidden).toBe(false);
        expect(folders[0].snippets[0].isHidden).toBe(false);
      });

    });

  });

  describe('Theme', () => {

    it('should return light', () => {

      const store = {
        theme: SyntaxTheme.light,
        version: '0.0.0.',
        folders: []
      };

      window.localStorage.setItem(DATA_KEY, JSON.stringify(store));

      service = TestBed.get(DataService);
      expect(service.getTheme()).toBe(SyntaxTheme.light);

    });

    it('should return dark', () => {

      const store = {
        theme: SyntaxTheme.dark,
        version: '0.0.0.',
        folders: []
      };

      window.localStorage.setItem(DATA_KEY, JSON.stringify(store));

      service = TestBed.get(DataService);
      expect(service.getTheme()).toBe(SyntaxTheme.dark);

    });

  });

  describe('Move items', () => {

    it('folders', done => {

      const data = [
        { id: '000000', isEditing: false, name: 'Folder 1', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder 2', snippets: [], tags: [], isHidden: false },
        { id: '222222', isEditing: false, name: 'Folder 3', snippets: [], tags: [], isHidden: false },
        { id: '333333', isEditing: false, name: 'Folder 4', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);
      spyOn(service, 'writeToLocalStorage');

      service.moveFolder(2, 1);

      const p1 = service.folders$.pipe(first()).toPromise();
      const p2 = service.folder$.pipe(first()).toPromise();

      Promise.all([p1, p2]).then(values => {

        const r1 = values[0];
        const r2 = values[1];

        expect(r1[0].id).toBe('000000');
        expect(r1[1].id).toBe('222222');
        expect(r1[2].id).toBe('111111');
        expect(r1[3].id).toBe('333333');
        expect(r2.id).toBe('222222');
        expect(service.writeToLocalStorage).toHaveBeenCalledTimes(1);
        done();
      });

    });

    it('snippets', done => {

      const s1 = {
        id: 'AAAAAA',
        data: 'Data',
        name: 'Name',
        dateCreated: new Date(),
        dateModified: new Date(),
        language: Language.javascript,
        locked: false,
        isHidden: false
      };
      const s2 = Object.assign({}, s1, { id: 'BBBBBB' });
      const s3 = Object.assign({}, s1, { id: 'CCCCCC' });
      const s4 = Object.assign({}, s1, { id: 'DDDDDD' });

      const data = [{
        id: '000000',
        isEditing: false,
        name: 'Folder 1',
        snippets: [s1, s2, s3, s4],
        tags: [],
        isHidden: false
      }];

      writeToStore(data);
      service = TestBed.get(DataService);
      spyOn(service, 'writeToLocalStorage');

      service.moveSnippets(2, 1);

      service.folder$
        .pipe(first())
        .subscribe(folder => {

          const snippets = folder.snippets;

          expect(snippets[0].id).toBe('AAAAAA');
          expect(snippets[1].id).toBe('CCCCCC');
          expect(snippets[2].id).toBe('BBBBBB');
          expect(snippets[3].id).toBe('DDDDDD');

          done();
        });

    });

    it('invalid bounds should do nothing', done => {

      const data = [
        { id: '000000', isEditing: false, name: 'Folder 1', snippets: [], tags: [], isHidden: false },
        { id: '111111', isEditing: false, name: 'Folder 2', snippets: [], tags: [], isHidden: false },
        { id: '222222', isEditing: false, name: 'Folder 3', snippets: [], tags: [], isHidden: false },
        { id: '333333', isEditing: false, name: 'Folder 4', snippets: [], tags: [], isHidden: false }
      ];

      writeToStore(data);
      service = TestBed.get(DataService);
      spyOn(service, 'writeToLocalStorage');

      service.moveFolder(2, 10);

      const p1 = service.folders$.pipe(first()).toPromise();
      const p2 = service.folder$.pipe(first()).toPromise();

      Promise.all([p1, p2]).then(values => {

        const r1 = values[0];
        const r2 = values[1];

        expect(r1[0].id).toBe('000000');
        expect(r1[1].id).toBe('111111');
        expect(r1[2].id).toBe('222222');
        expect(r1[3].id).toBe('333333');
        expect(r2.id).toBe('000000');
        expect(service.writeToLocalStorage).toHaveBeenCalledTimes(1);
        done();
      });

    });

  });
});
