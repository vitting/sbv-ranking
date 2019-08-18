import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  animations: [
    trigger("hideMessage", [
      state("show", style({
        opacity: "1",
        transform: "scaleY(1)",
        height: "100px",
        marginBottom: "10px"
      })),
      state("hide", style({
        opacity: "0",
        transform: "scaleY(0)",
        height: "0px",
        marginBottom: "0px"
      })),
      transition("show <=> hide", animate(200))
    ])
  ]
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  state = "hide";
  private errorMessageSub: Subscription;
  constructor(private errorMessageService: ErrorMessageService) { }

  ngOnInit() {
    this.errorMessageSub = this.errorMessageService.showMessageChanges$.subscribe((show) => {
      this.state = show ? "show" : "hide";
    });
  }

  ngOnDestroy(): void {
    if (this.errorMessageSub) {
      this.errorMessageSub.unsubscribe();
    }
  }

  closeError() {
    this.errorMessageService.showMessage = false;
  }
}
