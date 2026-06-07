import {SingleChoiceQuestion, BooleanQuestion, MultipleChoiceQuestion} from "./question";

export type FlashCard = {

    mainContent: string;
    multipleChoiceQuestions: MultipleChoiceQuestion[];
    singleChoiceQuestions: SingleChoiceQuestion[];
    booleanQuestions: BooleanQuestion[];

};
