import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Match } from 'src/app/models/match.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ranking-details',
  templateUrl: './ranking-details.component.html',
  styleUrls: ['./ranking-details.component.scss']
})
export class RankingDetailsComponent implements OnInit {
  chart: Chart;
  position = 0;
  points = 0;
  matchesTotal = 0;
  matchesWon = 0;
  matchesLost = 0;
  playerMatches: string[] = [];
  year = 0;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private firestoreService: FirestoreService,
    private authService: AuthService) { }

  ngOnInit() {
    if ("id" in this.route.snapshot.params && "p" in this.route.snapshot.queryParams) {
      const userId = this.route.snapshot.params.id;
      this.year = this.utilityService.currentYear;
      this.position = this.route.snapshot.queryParams.p;
      this.user  = this.authService.getUserInfo(userId);
      this.points = this.user.seasons[this.year].points;
      this.matchesWon = this.user.seasons[this.year].matchesWon;
      this.matchesLost = this.user.seasons[this.year].matchesLost;
      this.matchesTotal = this.matchesLost + this.matchesWon;
      this.playerMatches = this.user.seasons[this.year].matches;
    }
  }

  showMatches() {
    this.router.navigate(["matches"], {
      relativeTo: this.route
    });
  }

  async test() {
    const data = await this.firestoreService.getUserChartData(this.user.id, "d");
    const labelArray: string[] = [];
    const matchesArray: number[] = [];
    const pointsArray: number[] = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const item = data[key];
        labelArray.push(key);
        matchesArray.push(item.matches);
        pointsArray.push(item.points);
      }
    }
    // console.log(labelArray, matchesArray, pointsArray);
    this.chart = new Chart("canvas", {
      type: "line",
      data: {
        labels: labelArray,
        datasets: [
          {
            label: "Point vundet",
            backgroundColor: "#512DA842",
            borderColor: "#512DA8",
            data: pointsArray,
          },
          {
            label: "Spillede kampe",
            borderColor: "#ffb300",
            backgroundColor: "#ffb30042",
            data: matchesArray,
          }
        ]
      },
      options: {
        title: {
          text: "Spillede kampe"
        },
        responsive: true,
        scales: {
          yAxes: [{ticks: {beginAtZero: true}}],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Uge'
            }
          }]
        }
      }
    });
  }
}
