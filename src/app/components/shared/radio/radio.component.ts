import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent implements OnInit {
  @Input() selected = false;
  @Input() value = -1;
  @Output() radioClick: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

  radioClicked() {
    this.radioClick.emit(this.value);
  }
}
