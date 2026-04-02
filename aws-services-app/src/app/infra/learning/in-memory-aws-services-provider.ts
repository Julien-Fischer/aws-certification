import {Injectable} from "@angular/core";
import {AwsService} from "../../domain/learning/models/aws-service.model";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AwsServicesProvider} from "../../domain/learning/aws-service-provider";
import {MarkdownParserService} from "./markdown-parser.service";
import {FlashCard} from "../../domain/learning/models/flash-card";
import {FlashCardId} from "../../domain/shared/FlashCardId";

@Injectable({
    providedIn: 'root'
})
export class InMemoryAwsServicesProvider implements AwsServicesProvider {

    constructor(
        private http: HttpClient,
        private markdownParser: MarkdownParserService,
    ) { }

    getAll(): Observable<AwsService[]> {
        return this.http.get<AwsService[]>('assets/cards-categories.json');
    }

    getRevisionCard(id: FlashCardId): Observable<FlashCard> {
        return this.http.get(`/assets/markdown/${id}.md`, { responseType: 'text' }).pipe(
            map(content => this.markdownParser.parse(content)
        ));
    }

}
