import { Component, OnInit, Input } from '@angular/core';
import { Match } from 'src/app/models/match.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ranking-details-matches',
  templateUrl: './ranking-details-matches.component.html',
  styleUrls: ['./ranking-details-matches.component.scss']
})
export class RankingDetailsMatchesComponent implements OnInit {
  matches: Match[] = [];
  user: User;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private firestoreService: FirestoreService) { }

  ngOnInit() {
    if ("id" in this.route.snapshot.params) {
      const userId = this.route.snapshot.params.id;
      this.user  = this.authService.getUserInfo(userId);
      this.getMatches(this.user.id, 0);
    }
  }

  private getMatches(userId: string, limit: number = 0) {
    this.firestoreService.getPlayerMatches(userId, limit).subscribe((matches) => {
      this.matches = matches;
    });
  }
}
