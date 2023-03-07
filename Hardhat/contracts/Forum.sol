// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Forum {
    struct Question {
        uint256 questionId;
        string message;
        address creatorAddress;
        uint256 timestamp;
    }

    struct Answer {
        uint256 answerId;
        uint256 questionId;
        string message;
        address creatorAddress;
        uint256 timestamp;
        uint256 upvotes;
    }

    Question[] public questions;
    Answer[] public answers;
    mapping(uint256 => uint256[]) public answerPerQuestion;
    mapping(uint256 => mapping(address => bool)) public upvoters;
    mapping(address => uint256) public userUpvoteCount;

    event QuestionAdded(Question question);
    event AnswerAdded(Answer answer);
    event AnswerUpvoted(Answer answer);

    IERC20 public immutable Goflow;
    uint256 constant decimal = 18;

    uint256 amountToPay = 1 * 10**decimal;
    uint256 amountToPayParticipate = 10 * 10**decimal;

    constructor(address _tokenAddress) {
        Goflow = IERC20(_tokenAddress);
    }

    modifier answerExists(uint256 _answerId) {
        require(answers.length >= _answerId, "Answer does not exist");
        _;
    }

    function postQuestion(string calldata _message) external {
        uint256 questionCounter = questions.length;
        Question memory question = Question({
            questionId: questionCounter,
            message: _message,
            creatorAddress: msg.sender,
            timestamp: block.timestamp
        });
        questions.push(question);
        emit QuestionAdded(question);
    }

    function postAnswer(uint256 questionId, string calldata _message) external {
        uint256 answerCounter = answers.length;
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

    function upvoteAnswer(uint256 _answerId) external answerExists(_answerId) {
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

    function getUpvotes(uint256 _answerId)
        public
        view
        answerExists(_answerId)
        returns (uint256)
    {
        return answers[_answerId].upvotes;
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }

    function getAnswersPerQuestion(uint256 _questionId)
        public
        view
        returns (uint256[] memory)
    {
        return answerPerQuestion[_questionId];
    }
}
