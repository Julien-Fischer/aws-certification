import {MultipleChoiceQuiz, TrueFalseQuiz} from "./quiz";

export type FlashCard = {

    mainContent: string;
    multipleChoiceQuizzes: MultipleChoiceQuiz[];
    trueFalseQuizzes: TrueFalseQuiz[];
};
