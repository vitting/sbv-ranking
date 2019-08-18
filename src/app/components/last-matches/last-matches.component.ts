import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs';
import { Match } from 'src/app/models/match.model';

@Component({
  selector: 'app-last-matches',
  templateUrl: './last-matches.component.html',
  styleUrls: ['./last-matches.component.scss']
})
export class LastMatchesComponent implements OnInit {
  @Input() limit = 3;
  matches$: Observable<Match[]>;
  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.matches$ = this.firestoreService.getMatches(this.limit);
  }

}
