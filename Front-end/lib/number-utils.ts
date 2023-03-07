import { BigNumber, ethers } from "ethers"

const makeBig = (value: string | number): BigNumber => {
  if (typeof value === "number") {
    value = value.toString()
  }
  return ethers.utils.parseUnits(value, 18)
}

const makeNum = (value: BigNumber): string => {
  const numStr = ethers.utils.formatUnits(value, 18)
  return numStr.substring(0, numStr.indexOf(".") + 3) // keep only 2 decimal
}

export { makeBig, makeNum }
