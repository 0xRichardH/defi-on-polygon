import type { BigNumber } from "ethers";
import { useContract, useProvider } from "wagmi";
import ForumContract from "../../../Hardhat/artifacts/contracts/Forum.sol/Forum.json";

export interface Question {
  questionId: BigNumber;
  message: string;
  creatorAddress: string;
  timestamp: BigNumber;
}

const useForumContract = () => {
  const provider = useProvider();
  const contract = useContract({
    addressOrName: "0x873490634066cd71d0805C8aD45563D025037d1f",
    contractInterface: ForumContract.abi,
    signerOrProvider: provider,
  });

  const getQuestion = async (questionId: BigNumber): Promise<Question> => {
    return { ...(await contract.getQuestion(questionId)) };
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getQuestion,
  };
};

export default useForumContract;
