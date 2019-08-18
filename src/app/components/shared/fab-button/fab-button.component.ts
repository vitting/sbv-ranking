import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FabButtonService } from 'src/app/services/fab-button.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  animations: [
    trigger("buttonMove", [
      state("right", style({
        right: '25px'
      })),
      state("left", style({
        left: '25px'
      })),
      transition("right <=> left", animate(200))
    ]),
    trigger("buttonHide", [
      state("show", style({
        opacity: '1',
        zIndex: "999"
      })),
      state("hide", style({
        opacity: '0',
        zIndex: "-20"
      })),
      transition("show => hide", animate(5)),
      transition("hide => show", animate(200))
    ])
  ]
})
export class FabButtonComponent implements OnInit, OnDestroy {
  @Output() fabClick = new EventEmitter<void>();
  @Input() iconType = "add";
  @Input() state = "right";
  @Input() buttonShowState = "show";
  private showFabButtonChangeSub: Subscription;
  constructor(private fabButtonService: FabButtonService) { }

  ngOnInit() {
    this.showFabButtonChangeSub = this.fabButtonService.showFabButtonChange$.subscribe((show) => {
      if (show) {
        this.buttonShowState = "show";
      } else {
        this.buttonShowState = "hide";
      }
    });
  }

  ngOnDestroy(): void {
    if (this.showFabButtonChangeSub) {
      this.showFabButtonChangeSub.unsubscribe();
    }
  }

  onFabClick() {
    this.fabClick.emit();
  }

  moveButton() {
    if (this.state === "left") {
      this.state = "right";
    } else {
      this.state = "left";
    }
  }
}
