import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-data-loading',
  templateUrl: './data-loading.component.html',
  styleUrls: ['./data-loading.component.css']
})
export class DataLoadingComponent implements OnInit {

  @Input() isDataLoaded: boolean;

  MAX_LOADING_DURATION = 10_000; // in ms
  isLoadingTooLong = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout( () => {
      this.isLoadingTooLong = true;
    }, this.MAX_LOADING_DURATION);
  }
}
