import type { BigNumber } from "ethers";
import * as wagmi from "wagmi";
import { useProvider } from "wagmi";
import ForumContract from "../../../Hardhat/artifacts/contracts/Forum.sol/Forum.json";

export interface Question {
  questionId: BigNumber;
  message: string;
  creatorAddress: string;
  timestamp: BigNumber;
}

export interface Answer {
  answerId: BigNumber;
  questionId: BigNumber;
  creatorAddress: string;
  message: string;
  timestamp: BigNumber;
  upvotes: BigNumber;
}

const useForumContract = () => {
  const provider = useProvider();
  const contract = wagmi.useContract({
    addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    contractInterface: ForumContract.abi,
    signerOrProvider: provider,
  });

  const getAllQuestions = async (): Promise<Question[]> => {
    const qArray = await contract.getQuestions();
    return qArray.map((q: Question) => ({ ...q }));
  };

  const getQuestion = async (questionId: BigNumber): Promise<Question> => {
    return { ...(await contract.questions(questionId)) };
  };

  const getAnswers = async (questionId: BigNumber): Promise<Answer[]> => {
    const answerIds: BigNumber[] = await contract.getAnswersPerQuestion(
      questionId
    );
    const mappedAnswers = answerIds.map((answerId: BigNumber) =>
      contract.answers(answerId)
    );
    const allAnswers = await Promise.all(mappedAnswers);
    return allAnswers.map((a: Answer) => ({ ...a }));
  };

  const getUpvotes = async (answerId: BigNumber): Promise<BigNumber> => {
    return await contract.getUpvotes(answerId);
  };

  const postQuestion = async (message: string): Promise<void> => {
    const tx = await contract.postQuestion(message);
    await tx.wait();
  };

  const postAnswer = async (
    questionId: BigNumber,
    message: string
  ): Promise<void> => {
    const tx = await contract.postAnswer(questionId, message);
    await tx.wait();
  };

  const upvoteAnswer = async (answerId: BigNumber): Promise<void> => {
    const tx = await contract.postAnswer(answerId);
    await tx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getAllQuestions,
    getQuestion,
    getAnswers,
    getUpvotes,
    postQuestion,
    postAnswer,
    upvoteAnswer,
  };
};

export default useForumContract;
