import {InjectionToken} from "@angular/core";
import {AwsService} from "./models/aws-service.model";
import {Observable} from "rxjs";
import {RevisionCard} from "./models/revision-card";

export const awsServicesProviderInjectionToken = new InjectionToken<AwsServicesProvider>('AwsServicesProvider');

export interface AwsServicesProvider {

    getAll(): AwsService[];

    getRevisionCards(filename: string): Observable<RevisionCard>;
}
