import {InjectionToken} from "@angular/core";
import {FlashCardMetadata} from "./models/aws-service.model";
import {Observable} from "rxjs";
import {FlashCard} from "./models/flash-card";
import {FlashCardId} from "../shared/FlashCardId";

export const awsServicesProviderInjectionToken = new InjectionToken<AwsServicesProvider>('AwsServicesProvider');

export interface AwsServicesProvider {

    getAll(): Observable<FlashCardMetadata[]>;

    getRevisionCard(id: FlashCardId): Observable<FlashCard>;
}
