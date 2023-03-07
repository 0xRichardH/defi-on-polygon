import { useQuery } from "react-query"
import { useAccount } from "wagmi"
import useForumContract from "./contracts/useForumContract"
import useGoflowContract from "./contracts/useGoflowContract"

const useBalance = () => {
  const forumContract = useForumContract()
  const goflowContract = useGoflowContract()
  const { address: account } = useAccount()

  const contractBalanceQuery = useQuery(["contractBalance"], async () => {
    return await goflowContract.getBalance(forumContract.contract.address)
  })

  const userBalanceQuery = useQuery(["userBalance", account], async () => {
    if (account) {
      return await goflowContract.getBalance(account)
    } else {
      return "0"
    }
  })

  return { contractBalanceQuery, userBalanceQuery }
}

export default useBalance
