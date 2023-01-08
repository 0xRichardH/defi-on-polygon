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

const useForumContract = () => {
  const provider = useProvider();
  const contract = wagmi.useContract({
    addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    contractInterface: ForumContract.abi,
    signerOrProvider: provider,
  });

  const getQuestion = async (questionId: BigNumber): Promise<Question> => {
    return { ...(await contract.questions(questionId)) };
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getQuestion,
  };
};

export default useForumContract;
