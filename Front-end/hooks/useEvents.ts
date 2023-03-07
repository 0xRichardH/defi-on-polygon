import { BigNumber } from "ethers"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useAccount } from "wagmi"
import useForumContract, { ForumEvent } from "./contracts/useForumContract"
import useGoflowContract from "./contracts/useGoflowContract"

interface UseEventsQuery {
  questionId?: BigNumber
}

const useEvents = ({ questionId }: UseEventsQuery) => {
  const { address: account } = useAccount()
  const queryClient = useQueryClient()
  const forumContract = useForumContract()
  const tokenContract = useGoflowContract()

  useEffect(() => {
    const questionHandler = (question: any) => {
      console.log("what is the questin?", question)
    }

    forumContract.contract.on(ForumEvent.AnswerAdded, questionHandler)

    return () => {
      forumContract.contract.off(ForumEvent.AnswerAdded, questionHandler)
    }
  }, [queryClient, questionId, account, forumContract, tokenContract])
}

export default useEvents
