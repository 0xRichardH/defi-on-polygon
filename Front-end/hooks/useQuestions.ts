import { BigNumber } from "ethers";
import useForumContract from "./contracts/useForumContract";
import { useQuery } from "react-query";

interface UseQuestionQuery {
  questionId?: BigNumber;
}

const useQuestions = ({ questionId }: UseQuestionQuery) => {
  const contract = useForumContract();
  const questionQuery = useQuery(
    ["question", questionId?.toNumber()],
    async () => {
      if (questionId) {
        return await contract.getQuestion(questionId);
      }
    },
    { enabled: !!questionId }
  );
  const allQuestionsQuery = useQuery(["questions"], async () => {
    return await contract.getAllQuestions();
  });

  return { questionQuery, allQuestionsQuery };
};

export default useQuestions;
