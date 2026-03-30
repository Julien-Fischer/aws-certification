import {MultipleChoiceQuiz, TrueFalseQuiz} from "./quiz";

export type RevisionCard = {

    mainContent: string;
    multipleChoiceQuizzes: MultipleChoiceQuiz[];
    trueFalseQuizzes: TrueFalseQuiz[];
};
