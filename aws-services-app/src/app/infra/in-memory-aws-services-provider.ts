import {Injectable} from "@angular/core";
import {AwsService} from "../domain/models/aws-service.model";
import {AWS_SERVICES} from "./services";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AwsServicesProvider} from "../domain/services/aws-service-provider";
import {MarkdownParserService} from "./markdown-parser.service";
import {RevisionCard} from "../domain/models/revision-card";

@Injectable({
    providedIn: 'root'
})
export class InMemoryAwsServicesProvider implements AwsServicesProvider {

    constructor(
        private http: HttpClient,
        private markdownParser: MarkdownParserService
    ) { }

    getAll(): AwsService[] {
        return AWS_SERVICES;
    }

    getRevisionCards(filename: string): Observable<RevisionCard> {
        return this.http.get(`/assets/markdown/${filename}`, { responseType: 'text' }).pipe(
            map(content => this.markdownParser.parse(content)
        ));
    }

}