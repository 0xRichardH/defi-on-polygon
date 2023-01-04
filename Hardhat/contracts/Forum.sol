// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    mapping(uint => mapping(address => bool)) public upvoters;
    mapping(address => uint) public userUpvoteCount;

    event QuestionAdded(Question question);
    event AnswerAdded(Answer answer);
    event AnswerUpvoted(Answer answer);

    IERC20 public immutable Goflow;
    uint constant decimal = 18;

    uint amountToPay = 1 * 10 ** decimal;
    uint amountToPayParticipate = 10 * 10 ** decimal;

    constructor(address _tokenAddress) {
        Goflow = IERC20(_tokenAddress);
    }

    modifier answerExists(uint _answerId) {
        require(answers.length >= _answerId, "Answer does not exist");
        _;
    }

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

    function upvoteAnswer(uint _answerId) external answerExists(_answerId) {
        Answer storage currentAnswer = answers[_answerId];

        require(
            upvoters[_answerId][msg.sender] != true,
            "You already upvoted this answer"
        );
        require(
            currentAnswer.creatorAddress != msg.sender,
            "You cannot upvote your own answer"
        );
        require(
            Goflow.balanceOf(msg.sender) >= amountToPay,
            "You do not have enough GOFLOW tokens to upvote this answer"
        );
        require(
            Goflow.allowance(msg.sender, address(this)) >= amountToPay,
            "You need to approve the contract to spend your GOFLOW tokens"
        );

        bool sent;
        if (
            Goflow.balanceOf(currentAnswer.creatorAddress) >=
            amountToPayParticipate
        ) {
            sent = Goflow.transferFrom(
                msg.sender,
                currentAnswer.creatorAddress,
                amountToPay
            );
        } else {
            sent = Goflow.transferFrom(msg.sender, address(this), amountToPay);
        }

        require(sent, "Failed to send GOFLOW tokens");
        currentAnswer.upvotes++;
        userUpvoteCount[msg.sender]++;
        upvoters[_answerId][msg.sender] = true;
        emit AnswerUpvoted(currentAnswer);
    }

    function getUpvotes(
        uint _answerId
    ) public view answerExists(_answerId) returns (uint) {
        return answers[_answerId].upvotes;
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }

    function getAnswersPerQuestion(
        uint _questionId
    ) public view returns (uint[] memory) {
        return answerPerQuestion[_questionId];
    }
}
