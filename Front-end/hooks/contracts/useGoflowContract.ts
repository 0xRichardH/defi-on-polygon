import { useContract, useProvider, useSigner } from "wagmi"
import { BigNumber } from "ethers"
import GoflowContract from "../../../Hardhat/artifacts/contracts/OurToken.sol/Goflow.json"
import { makeNum } from "../../lib/number-utils"

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
  const { data: signer } = useSigner()
  const provider = useProvider()
  const contract = useContract({
    addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
