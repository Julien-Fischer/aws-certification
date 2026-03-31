import {InjectionToken} from "@angular/core";
import {AwsService} from "./models/aws-service.model";
import {Observable} from "rxjs";
import {RevisionCard} from "./models/revision-card";
import {AwsServiceId} from "../shared/AwsServiceId";

export const awsServicesProviderInjectionToken = new InjectionToken<AwsServicesProvider>('AwsServicesProvider');

export interface AwsServicesProvider {

    getAll(): AwsService[];

    getRevisionCards(id: AwsServiceId): Observable<RevisionCard>;
}
