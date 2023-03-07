import { useMutation } from "react-query"
import { makeBig } from "../lib/number-utils"
import useGoflowContract from "./contracts/useGoflowContract"

interface UseAddMintPayload {
  amount: string
}

const useAddMint = () => {
  const contract = useGoflowContract()
  return useMutation(async ({ amount }: UseAddMintPayload) => {
    await contract.mint(makeBig(amount))
  })
}

export default useAddMint
