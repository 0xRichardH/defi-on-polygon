import type { BigNumber } from "ethers"

export interface Question {
  questionId: BigNumber
  message: string
  creatorAddress: string
  timestamp: BigNumber
}

const useForumContract = () => {

}
