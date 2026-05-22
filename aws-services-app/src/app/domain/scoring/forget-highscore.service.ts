import {Inject, Injectable} from "@angular/core";
import {FlashCardId} from "../shared/flash-card-id";
import Highscore from "./models/highscore";
import {Storage, storageInjectionToken} from "./storage";
import {HighscoreEraser} from "./highscore-eraser";
import {Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ForgetHighscoreService implements HighscoreEraser {

    private resetSubject = new Subject<void>();
    readonly onReset: Observable<void> = this.resetSubject.asObservable();

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

  forget(serviceId: FlashCardId): void {
      this.storage.clear(serviceId);
      this.resetSubject.next();
  }

  forgetAll(): void {
      this.storage.clear();
      this.resetSubject.next();
  }

}
