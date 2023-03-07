import * as React from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useAccount, useConnect, useNetwork } from "wagmi"
import toast from "react-hot-toast"
import { InjectedConnector } from "wagmi/connectors/injected"

interface AuthButtonProps extends ButtonProps {
  text: string
}

const AuthButton: React.FunctionComponent<AuthButtonProps> = ({
  text,
  ...props
}) => {
  const [btnText, setBtnText] = React.useState("Sign In")
  const { connect, error } = useConnect({
    connector: new InjectedConnector(),
  })
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  React.useEffect(() => {
    if (error?.name === "ConnectorNotFoundError") {
      toast.error("Please install Metamask")
    }

    if (isConnected && chain?.id !== 1337) {
      toast.error("Please connect to the local network")
    }
  }, [error, chain, isConnected])

  React.useEffect(() => {
    if (isConnected) {
      setBtnText(text)
    } else {
      setBtnText("Sign In")
    }
  }, [isConnected])

  if (isConnected) {
    return <Button {...props}>{btnText}</Button>
  } else {
    return (
      <Button
        {...props}
        onClick={() => {
          !isConnected && connect()
        }}
      >
        {btnText}
      </Button>
    )
  }
}

export default AuthButton
