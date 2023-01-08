import type { NextPage } from "next";
import * as React from "react";
import { Box, Text, Stack, Image } from "@chakra-ui/react";
import useForumContract from "../hooks/contracts/useForumContract";
import { BigNumber } from "ethers";
import AuthButton from "../components/AuthButton";

const App: NextPage = () => {
  const contract = useForumContract();

  React.useEffect(() => {
    const fetchQuestion = async () => {
      console.log(
        "are we connecting to the contract?",
        await contract.getQuestion(BigNumber.from(0))
      );
    };
    fetchQuestion();
  }, [contract]);

  return (
    <Box p={8} maxW="600px" minW="320px" m="0 auto">
      <Stack align="center">
        <Image
          width={300}
          src="https://c.tenor.com/ILZS6yuNQ3wAAAAC/yo-chris-farley.gif"
        />
        <Text align="center">
          This is the beginning of a journey through the DeFi universe
          <br />
          with our good friends at Polygon
        </Text>
        <AuthButton text="Connected!" />
      </Stack>
    </Box>
  );
};

export default App;
