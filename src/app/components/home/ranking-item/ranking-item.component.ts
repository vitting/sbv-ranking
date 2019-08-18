import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-ranking-item',
  templateUrl: './ranking-item.component.html',
  styleUrls: ['./ranking-item.component.scss']
})
export class RankingItemComponent implements OnInit {
  @Input() user: User;
  @Input() position = 0;
  constructor() { }

  ngOnInit() {
  }

  rowClicked() {
    console.log("RowClick");
  }
}
