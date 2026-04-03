import {MultipleChoiceQuestion, TrueFalseQuestion} from "./question";

export type FlashCard = {

    mainContent: string;
    multipleChoiceQuestions: MultipleChoiceQuestion[];
    trueFalseQuestions: TrueFalseQuestion[];

};
