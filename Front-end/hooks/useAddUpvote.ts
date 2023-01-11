import { BigNumber } from "ethers";
import useForumContract from "./contracts/useForumContract";
import { useMutation } from "react-query";

interface UseAddUpvotePayload {
  answerId: BigNumber;
}

const useAddUpvote = ({ answerId }: UseAddUpvotePayload) => {
  const contract = useForumContract();
  return useMutation(async () => {
    return await contract.upvoteAnswer(answerId);
  });
};
