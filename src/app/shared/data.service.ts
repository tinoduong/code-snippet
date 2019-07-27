import { Injectable } from '@angular/core';
import { Folder, Snippet, Language, Store } from './globals';
import { BehaviorSubject, Observable } from 'rxjs';
import { SyntaxTheme } from './globals';
import { throwIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private theme: SyntaxTheme;
  private isSearching: boolean;
  private version;

  // The list of folders
  private folders = new BehaviorSubject<Folder[]>(undefined);
  folders$: Observable<Folder[]> = this.folders.asObservable();

  // The active folder
  private folder = new BehaviorSubject<Folder>(undefined);
  folder$: Observable<Folder> = this.folder.asObservable();

  // The active snippet
  private snippet = new BehaviorSubject<Snippet>(undefined);
  snippet$: Observable<Snippet> = this.snippet.asObservable();

  constructor() {

    const defFolders =  [{ id: this.uuidv4(),
      isEditing: false,
      name: 'New Folder',
      snippets: [this.createSnippet()], tags: [], isHidden: false }
    ];
    const defStore = { version: '0.0.0', theme: SyntaxTheme.light, folders: defFolders };
    const fullData = this.readFromLocalStorage();
    const store = !fullData || !fullData.folders ? defStore : fullData;

    this.version = store.version;
    this.theme = store.theme;
    this.isSearching = false;

    // always start the session without filters
    this.removeHidden();

    this.broadcastData(store.folders);
  }

  private broadcastData(folders ?: Folder[]) {

    if (folders) {
      this.folders.next(folders);
    }

    const data = folders || this.getFolders();

    const firstFolder = data.filter(f => !f.isHidden);

    if (!firstFolder.length) {

      this.folder.next(null);
      this.snippet.next(null);
      return;
    }

    const firstSnippet = firstFolder[0].snippets.filter(s => !s.isHidden);
    this.folder.next(firstFolder[0]);

    if (!firstSnippet.length) {
      this.snippet.next(null);
      return;
    }

    this.snippet.next(firstSnippet[0]);
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      /* tslint:disable */
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
      /* tslint:enable */
    });
  }

  private createFolder(): Folder {
    return {
      id: this.uuidv4(),
      isEditing: false,
      name: 'Folder Name',
      snippets: [],
      tags: [],
      isHidden: false
    };
  }

  private createSnippet(): Snippet {

    const date = new Date();

    return {
      id: this.uuidv4(),
      data: 'Data',
      name: 'Name',
      dateCreated: date,
      dateModified: date,
      language: Language.javascript,
      locked: false,
      isHidden: false
    };

  }

  private cloneData(toClone: any) {

    const str = JSON.stringify(toClone);
    const nData = JSON.parse(str);
    return nData;
  }

  private getFolders(): Folder[] {
    return this.folders.value;
  }

  private removeHidden() {

    if (this.isSearching) { return; }
    const data = this.getFolders() || [];

    data.forEach(folder => {
      folder.isHidden = false;
      folder.snippets.forEach(snippet => {
        snippet.isHidden = false;
      });
    });

  }

  turnOffEdit() {

    const folders = this.folders.value;

    folders.forEach(f => {
       f.isEditing = false;
    });

  }

  selectFolder(index: number) {

    this.turnOffEdit();
    const data = this.getFolders();
    const toSelect = data[index];

    this.folder.next(data[index]);

    if (toSelect.snippets.length) {

      const visible = toSelect.snippets.filter(s => {
        return !s.isHidden;
      });

      if (!visible.length) {
        this.selectSnippet(null);
      } else {
        this.selectSnippet(visible[0]);

      }

    }

  }

  addFolder() {

    this.turnOffEdit();
    const data = this.cloneData(this.folders.value);

    data.push(this.createFolder());

    this.folders.next(data);
    this.selectFolder(data.length - 1);
    this.writeToLocalStorage();
  }

  addSnippet() {
    const selectedFolder = this.folder.value;
    const sArr = this.cloneData(selectedFolder.snippets);
    const nSnippet = this.createSnippet();

    sArr.unshift(nSnippet);
    selectedFolder.snippets = sArr;

    this.selectSnippet(nSnippet);
    this.writeToLocalStorage();
  }

  toggleSnippet(i: number) {

    const cFolder = this.folder.value;
    const nSnippet = this.cloneData(cFolder.snippets[i]);
    const nSnippets = this.cloneData(cFolder.snippets);

    nSnippet.locked = !nSnippet.locked;
    nSnippets[i] = nSnippet;
    cFolder.snippets = nSnippets;

    this.folder.next(cFolder);
    this.snippet.next(nSnippet);
    this.writeToLocalStorage();
  }

  toggleFolderEdit(i: number, flag: boolean) {

    this.turnOffEdit();

    const folders = this.getFolders();
    const cFolder = this.cloneData(folders[i]);
    const nFolder = this.cloneData(cFolder);

    nFolder.isEditing = flag;
    folders[i] = nFolder;

    this.folder.next(nFolder);
  }

  updateSnippetLanguage(i: number, langauge: Language) {

    const cFolder = this.folder.value;
    const nSnippet = this.cloneData(cFolder.snippets[i]);
    const nSnippets = this.cloneData(cFolder.snippets);

    nSnippet.language = langauge;
    nSnippets[i] = nSnippet;
    cFolder.snippets = nSnippets;

    this.folder.next(cFolder);
    this.snippet.next(nSnippet);
    this.writeToLocalStorage();
  }

  removeFolder(id: string) {

    const data = this.getFolders();
    const updateData = data.filter((f) => {
      return f.id !== id;
    });

    this.folders.next(updateData);
    this.writeToLocalStorage();
  }

  selectSnippet(snippet: Snippet) {
    this.snippet.next(snippet);
  }

  removeSnippet(id: string) {

    const selectedFolder = this.folder.value;
    const nArr = selectedFolder.snippets.filter((s) => s.id !== id);
    selectedFolder.snippets = nArr;
    this.writeToLocalStorage();
  }

  getTheme(): SyntaxTheme {
    return this.theme;
  }

  setTheme(value: SyntaxTheme) {
    this.theme = value;
  }

  writeToLocalStorage() {

    this.removeHidden();

    const storage = window.localStorage;
    const store = {
      version: this.version,
      theme: this.theme,
      folders: this.getFolders()
    };

    // TODO: Turn this into a debounced call so
    // we can throttle how many times we write to the store.
    // Also, remove the one in main.component.ts when that
    // happens.
    storage.setItem('CodeCollectorData', JSON.stringify(store));
  }

  readFromLocalStorage(): Store {
    const storage = window.localStorage;
    const store = storage.getItem('CodeCollectorData');

    if (!store) {
      return null;
    }

    return JSON.parse(store);
  }

  updateSearchFilter(strSearch: string) {
    const data = this.getFolders();
    this.isSearching = !!strSearch;

    if (!strSearch) {

      this.removeHidden();
      this.broadcastData();
      return;
    }

    data.forEach(folder => {

      let searchFound = false;

      folder.snippets.forEach(snippet => {

        if (snippet.data.indexOf(strSearch) === -1) {
          snippet.isHidden = true;
          return;
        }

        searchFound = true;
        snippet.isHidden = false;
      });

      folder.isHidden = !searchFound;
    });

    this.broadcastData();
  }

  moveSnippets(prevIndex: number, currIndex: number ) {
    const folder = this.folder.value;
    const snippets = this.cloneData(folder.snippets);

    folder.snippets = this.moveItem(snippets, prevIndex, currIndex);

    this.folder.next(folder);
    this.writeToLocalStorage();
  }

  moveFolder(prevIndex: number, currIndex: number) {

    const folders = this.cloneData(this.getFolders());
    this.moveItem(folders, prevIndex, currIndex);

    this.folders.next(folders);
    this.folder.next(folders[currIndex] || this.folder.value);
    this.writeToLocalStorage();
  }

  private moveItem(arr: any, prevIndex: number, currIndex: number) {

    const max = arr.length - 1;
    const min = 0;
    const isInBounds = (val: number) => val >= min && val <= max;

    if (!isInBounds(prevIndex) || !isInBounds(currIndex)) {
      return arr;
    }

    const item = arr[prevIndex];
    arr.splice(prevIndex, 1);
    arr.splice(currIndex, 0, item);

    return arr;
  }
}
