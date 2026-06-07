import {SingleChoiceQuestion, BooleanQuestion} from "./question";

export type FlashCard = {

    mainContent: string;
    singleChoiceQuestions: SingleChoiceQuestion[];
    booleanQuestions: BooleanQuestion[];

};
