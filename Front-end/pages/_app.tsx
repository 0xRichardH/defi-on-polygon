import "@fontsource/poppins"
import theme from "../theme"
import type { AppProps } from "next/app"
import Navbar from "../components/Navbar"
import { ChakraProvider } from "@chakra-ui/react"
import { Toaster, toast } from "react-hot-toast"
import { ReactQueryDevtools } from "react-query/devtools"
import { QueryClient, QueryClientProvider, QueryCache } from "react-query"
import { providers } from "ethers"
import { createClient, WagmiConfig } from "wagmi"
import { loadEnv } from "../lib/env-utils"

// const localhostProvider = new providers.JsonRpcProvider(
//   "http://127.0.0.1:8545",
//   { name: "dev", chainId: 1337, ensAddress: undefined }
// )

const env = loadEnv()

const polygonProvider = new providers.JsonRpcProvider(env.PLOYGON_PROVIDER_URL)

const client = createClient({
  autoConnect: true,
  provider: polygonProvider,
})

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      toast.error(
        "Network Error: Ensure Metamask is connected & on the same network that your contract is deployed to."
      )
    },
  }),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
