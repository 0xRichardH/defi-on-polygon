// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Forum {
    struct Question {
        uint questionId;
        string message;
        address creatorAddress;
        uint timestamp;
    }

    struct Answer {
        uint answerId;
        uint questionId;
        string message;
        address creatorAddress;
        uint timestamp;
        uint upvotes;
    }

    Question[] public questions;
    Answer[] public answers;
    mapping(uint => uint[]) public answerPerQuestion;

    event QuestionAdded(Question question);
    event AnswerAdded(Answer answer);

    function postQuestion(string calldata _message) external {
        uint questionCounter = questions.length;
        Question memory question = Question({
            questionId: questionCounter,
            message: _message,
            creatorAddress: msg.sender,
            timestamp: block.timestamp
        });
        questions.push(question);
        emit QuestionAdded(question);
    }

    function postAnswer(uint questionId, string calldata _message) external {
        uint answerCounter = answers.length;
        Answer memory answer = Answer({
            answerId: answerCounter,
            questionId: questionId,
            message: _message,
            creatorAddress: msg.sender,
            timestamp: block.timestamp,
            upvotes: 0
        });
        answers.push(answer);
        answerPerQuestion[questionId].push(answerCounter);
        emit AnswerAdded(answer);
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }

    function getAnswersPerQuestion(uint _questionId) external view returns (uint[] memory) {
        return answerPerQuestion[_questionId];
    }
}
