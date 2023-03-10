import { useContract, useProvider, useSigner } from "wagmi"
import { BigNumber } from "ethers"
import GoflowContract from "../../../Hardhat/artifacts/contracts/OurToken.sol/Goflow.json"
import { makeNum } from "../../lib/number-utils"
import { loadEnv } from "../../lib/env-utils"

export enum TokenEvent {
  Transfer = "Transfer",
  Mint = "Mint",
}

export type Amount = BigNumber
export interface Transfer {
  from: string
  to: string
  amount: BigNumber
}

const useGoflowContract = () => {
  const env = loadEnv()
  const { data: signer } = useSigner()
  const provider = useProvider()
  const contract = useContract({
    addressOrName: env.GOFLOW_CONTRACT_ADDRESS,
    contractInterface: GoflowContract.abi,
    signerOrProvider: signer || provider,
  })

  const getBalance = async (address: string): Promise<string> => {
    const userBalanceNum = await contract.balanceOf(address)
    return makeNum(userBalanceNum)
  }

  const approve = async (address: string, amount: BigNumber): Promise<void> => {
    const tx = await contract.approve(address, amount)
    await tx.wait()
  }

  const mint = async (amount: BigNumber): Promise<void> => {
    const tx = await contract.mint(amount)
    await tx.wait()
  }

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    mint,
    approve,
    getBalance,
  }
}

export default useGoflowContract
