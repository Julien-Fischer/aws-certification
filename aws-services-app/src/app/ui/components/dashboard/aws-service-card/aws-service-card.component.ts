import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsService } from '../../../../domain/learning/models/aws-service.model';
import Highscore from "../../../../domain/scoring/models/highscore";
import {HighscoreBarsComponent} from "./highscore-bars/highscore-bars.component";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";

@Component({
  selector: 'app-aws-service-card',
  standalone: true,
  imports: [CommonModule, HighscoreBarsComponent],
  templateUrl: './aws-service-card.component.html',
  styleUrls: ['./aws-service-card.component.scss']
})
export class AwsServiceCardComponent {

  @Input({ required: true }) service!: AwsService;
  @Input({ required: true }) highscore!: Highscore;
  @Output() serviceClick = new EventEmitter<string>();

  gamification: Gamification;

  constructor(
      @Inject(gamificationInjectionToken) gamification: Gamification
  ) {
    this.gamification = gamification;

  }

  onCardClick(): void {
    this.serviceClick.emit(this.service.id);
  }

}
