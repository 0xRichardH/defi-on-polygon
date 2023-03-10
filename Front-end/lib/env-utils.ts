import invariant from "tiny-invariant"

const loadEnv = () => {
  const FORUM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FORUM_CONTRACT_ADDRESS
  const GOFLOW_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_GOFLOW_CONTRACT_ADDRESS
  const PLOYGON_PROVIDER_URL = process.env.NEXT_PUBLIC_PLOYGON_PROVIDER_URL

  invariant(FORUM_CONTRACT_ADDRESS, "FORUM_CONTRACT_ADDRESS is not defined")
  invariant(GOFLOW_CONTRACT_ADDRESS, "GOFLOW_CONTRACT_ADDRESS is not defined")
  invariant(PLOYGON_PROVIDER_URL, "PLOYGON_PROVIDER_URL is not defined")

  return {
    FORUM_CONTRACT_ADDRESS,
    GOFLOW_CONTRACT_ADDRESS,
    PLOYGON_PROVIDER_URL,
  }
}

export { loadEnv }
