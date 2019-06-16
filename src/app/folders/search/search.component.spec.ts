import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DataService } from 'src/app/shared/data.service';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
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

class MockDataService extends DataService {
  updateSearchFilter(strSearch: string) {
    return;
  }
}

describe('SearchComponent', () => {

  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let dataSvc;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      providers: [{provide: DataService, useClass: MockDataService}],
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

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    dataSvc = TestBed.get(DataService);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('icon', () => {

    it('should be search when text is empty', () => {

      const icon = fixture.debugElement.nativeElement.querySelector('.search-icon');
      expect(icon.textContent.trim()).toBe('search');
    });

    it('should be remove when text is filled in', fakeAsync(() => {

      const input = fixture.debugElement.nativeElement.querySelector('.search-container-input');
      const event = new Event('input');

      input.value = 'hello world';
      input.dispatchEvent(event);

      fixture.detectChanges();
      const icon = fixture.debugElement.nativeElement.querySelector('.search-icon');
      expect(icon.textContent.trim()).toBe('highlight_off');
    }));

    it('should trigger event when clicked', fakeAsync(() => {

      const event = new Event('input');
      const updateSearchFilter = spyOn(dataSvc, 'updateSearchFilter');
      const input = fixture.debugElement.nativeElement.querySelector('.search-container-input');

      input.value = 'Update value';
      input.dispatchEvent(event);
      fixture.detectChanges();

      const icon = fixture.debugElement.nativeElement.querySelector('.search-icon');
      icon.click();
      tick(600);
      fixture.detectChanges();

      expect(updateSearchFilter).toHaveBeenCalledTimes(1);
    }));

  });

  it('search input', fakeAsync(() => {

    const input = fixture.debugElement.nativeElement.querySelector('.search-container-input');
    const updateSearchFilter = spyOn(dataSvc, 'updateSearchFilter');
    const event = new Event('keyup');

    input.dispatchEvent(event);
    tick(600);
    fixture.detectChanges();

    expect(updateSearchFilter).toHaveBeenCalledTimes(1);
  }));

});
