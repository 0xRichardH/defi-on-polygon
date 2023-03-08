import { BigNumber, constants, Event } from "ethers"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useAccount } from "wagmi"
import { makeNum } from "../lib/number-utils"
import useForumContract, {
  Answer,
  ForumEvent,
} from "./contracts/useForumContract"
import useGoflowContract, { TokenEvent } from "./contracts/useGoflowContract"

interface UseEventsQuery {
  questionId?: BigNumber
}

const useEvents = ({ questionId }: UseEventsQuery) => {
  const { address: account } = useAccount()
  const queryClient = useQueryClient()
  const forumContract = useForumContract()
  const tokenContract = useGoflowContract()

  useEffect(() => {
    const questionHandler = () => {
      queryClient.invalidateQueries(["questions"])
    }

    const answerHandler = (answer: Answer, emittedEvent: Event) => {
      if (!questionId) return

      const answerQidNumber = answer.questionId.toNumber()
      const questionIdNumber = questionId.toNumber()
      const answerIdNumber = answer.answerId.toNumber()

      if (answerQidNumber !== questionIdNumber) {
        return
      }

      switch (emittedEvent.event) {
        case ForumEvent.AnswerAdded:
          queryClient.invalidateQueries(["answers", answerQidNumber])
        case ForumEvent.AnswerUpvoted:
          queryClient.invalidateQueries(["answers", answerIdNumber])
      }
    }

    const transferHandler = async (
      from: string,
      to: string,
      amount: BigNumber
    ) => {
      switch (true) {
        case to === forumContract.contract.address:
          console.log(`Transfered ${makeNum(amount)} to forum contract`)
          queryClient.invalidateQueries(["contractBalance"])
        case from === constants.AddressZero:
          console.log(`Minted ${makeNum(amount)} to ${to}`)
          queryClient.invalidateQueries(["userBalance", to])
        default:
          console.log(`Transfered ${makeNum(amount)} from ${from} to ${to}`)
          queryClient.invalidateQueries(["userBalance", to])
      }
    }

    forumContract.contract.on(ForumEvent.QuestionAdded, questionHandler)
    forumContract.contract.on(ForumEvent.AnswerAdded, answerHandler)
    forumContract.contract.on(ForumEvent.AnswerUpvoted, answerHandler)
    tokenContract.contract.on(TokenEvent.Transfer, transferHandler)

    return () => {
      forumContract.contract.off(ForumEvent.QuestionAdded, questionHandler)
      forumContract.contract.off(ForumEvent.AnswerAdded, answerHandler)
      forumContract.contract.off(ForumEvent.AnswerUpvoted, answerHandler)
      tokenContract.contract.off(TokenEvent.Transfer, transferHandler)
    }
  }, [queryClient, questionId, account, forumContract, tokenContract])
}

export default useEvents
