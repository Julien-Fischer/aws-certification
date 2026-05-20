import {Inject, Injectable} from "@angular/core";
import {FlashCardId} from "../shared/flash-card-id";
import Highscore from "./models/highscore";
import {Storage, storageInjectionToken} from "./storage";
import {HighscoreEraser} from "./highscore-eraser";

@Injectable({
    providedIn: 'root',
})
export class ForgetHighscoreService implements HighscoreEraser {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

  forget(serviceId: FlashCardId): void {
      this.storage.clear(serviceId);
  }

}
