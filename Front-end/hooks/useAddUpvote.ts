import { BigNumber } from "ethers";
import useForumContract from "./contracts/useForumContract";
import { useMutation } from "react-query";

interface UseAddUpvotePayload {
  answerId: BigNumber;
}

const useAddUpvote = () => {
  const contract = useForumContract();
  return useMutation(async ({ answerId }: UseAddUpvotePayload) => {
    return await contract.upvoteAnswer(answerId);
  });
};

export default useAddUpvote;
