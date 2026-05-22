import {Component, EventEmitter, Input, Output} from '@angular/core';
import Highscore from "../../../../domain/scoring/models/highscore";
import {DatePipe} from "@angular/common";
import {ScoreIndicatorComponent} from "../../generic/score-indicator.component";

@Component({
  selector: 'app-highscore-details',
  imports: [
    DatePipe,
    ScoreIndicatorComponent
  ],
  templateUrl: './highscore-details.component.html',
  styleUrl: './highscore-details.component.scss',
})
export class HighscoreDetailsComponent {

  @Input() highscore: Highscore = Highscore.NONE;
  @Output() onHighscoreReset = new EventEmitter<void>();

  protected readonly highscoreNONE = Highscore.NONE;

}
