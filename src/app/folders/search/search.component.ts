import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private search = '';
  constructor(private dataSvc: DataService) { }

  searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
    .pipe(debounceTime(500))
    .subscribe(() => {
      this.dataSvc.updateSearchFilter(this.search);
    });
  }

  onClick() {
    if (this.search) {
      this.search = '';
      this.searchSubject.next(this.search);
    }
  }

  onSearch() {
    this.searchSubject.next(this.search);
  }
}
