import {Injectable} from "@angular/core";
import {FlashCardMetadata} from "../../domain/search/models/metadata";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FlashCardProvider} from "../../domain/search/flash-card-provider";
import {MarkdownParserService} from "./markdown-parser.service";
import {FlashCard} from "../../domain/search/models/flash-card";
import {FlashCardId} from "../../domain/shared/flash-card-id";

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

    getCard(id: FlashCardId): Observable<FlashCard> {
        return this.http.get(`assets/markdown/${id}.md`, { responseType: 'text' }).pipe(
            map(content => this.markdownParser.parse(content)
        ));
    }

}
