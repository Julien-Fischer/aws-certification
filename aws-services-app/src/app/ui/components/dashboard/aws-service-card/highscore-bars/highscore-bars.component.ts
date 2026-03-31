import {Component, Input, SimpleChanges} from '@angular/core';
import Highscore from "../../../../../domain/scoring/models/highscore";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-highscore-bars',
  imports: [
    NgStyle
  ],
  templateUrl: './highscore-bars.component.html',
  styleUrl: './highscore-bars.component.scss',
})
export class HighscoreBarsComponent {

  @Input() highscore: Highscore = Highscore.NONE;

  progress = 0;
  accuracy = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['highscore'] && this.highscore) {
      this.progress = this.highscore.progress.value;
      this.accuracy = this.highscore.accuracy.value;
    } else {
      this.progress = 0;
      this.accuracy = 0;
    }
  }

  accuracyValue(): string {
    return this.highscore.accuracy.toFixed(0);
  }

  progressValue(): string {
    return this.highscore.progress.toFixed(0);
  }

}
