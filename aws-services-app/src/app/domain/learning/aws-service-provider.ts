import {InjectionToken} from "@angular/core";
import {AwsService} from "./models/aws-service.model";
import {Observable} from "rxjs";
import {FlashCard} from "./models/flash-card";
import {FlashCardId} from "../shared/FlashCardId";

export const awsServicesProviderInjectionToken = new InjectionToken<AwsServicesProvider>('AwsServicesProvider');

export interface AwsServicesProvider {

    getAll(): Observable<AwsService[]>;

    getRevisionCard(id: FlashCardId): Observable<FlashCard>;
}
