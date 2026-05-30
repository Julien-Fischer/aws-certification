import {MultipleChoiceQuestion, BooleanQuestion} from "./question";

export type FlashCard = {

    mainContent: string;
    multipleChoiceQuestions: MultipleChoiceQuestion[];
    booleanQuestions: BooleanQuestion[];

};
