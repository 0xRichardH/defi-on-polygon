import { Box } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import * as React from "react";
import Questions from "../components/Questions";
import useForumContract from "../hooks/contracts/useForumContract";

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
      <Questions />
    </Box>
  );
};

export default App;
