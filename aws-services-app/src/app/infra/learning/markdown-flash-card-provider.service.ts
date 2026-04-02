import {Injectable} from "@angular/core";
import {FlashCardMetadata} from "../../domain/learning/models/aws-service.model";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FlashCardProvider} from "../../domain/learning/flash-card-provider";
import {MarkdownParserService} from "./markdown-parser.service";
import {FlashCard} from "../../domain/learning/models/flash-card";
import {FlashCardId} from "../../domain/shared/FlashCardId";

@Injectable({
    providedIn: 'root'
})
export class MarkdownFlashCardProvider implements FlashCardProvider {

    constructor(
        private http: HttpClient,
        private markdownParser: MarkdownParserService,
    ) { }

    getAll(): Observable<FlashCardMetadata[]> {
        return this.http.get<FlashCardMetadata[]>('assets/cards-categories.json');
    }

    getRevisionCard(id: FlashCardId): Observable<FlashCard> {
        return this.http.get(`/assets/markdown/${id}.md`, { responseType: 'text' }).pipe(
            map(content => this.markdownParser.parse(content)
        ));
    }

}
