import invariant from "tiny-invariant"

const useEnv = () => {
  const FORUM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FORUM_CONTRACT_ADDRESS
  const GOFLOW_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_GOFLOW_CONTRACT_ADDRESS

  invariant(FORUM_CONTRACT_ADDRESS, "FORUM_CONTRACT_ADDRESS is not defined")
  invariant(GOFLOW_CONTRACT_ADDRESS, "GOFLOW_CONTRACT_ADDRESS is not defined")

  return { FORUM_CONTRACT_ADDRESS, GOFLOW_CONTRACT_ADDRESS }
}

export { useEnv }
