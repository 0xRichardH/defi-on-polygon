import { Button, ButtonProps, Icon, Text } from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import useUpvotes from "../hooks/useUpvotes";

interface UpvoteButtonProps extends ButtonProps {
  answerId: BigNumber;
}

const Upvote: React.FunctionComponent<UpvoteButtonProps> = ({
  answerId,
  ...props
}) => {
  const [upvoteCount, setUpvoteCount] = React.useState(0);
  const { address: account } = useAccount();
  const upvotesQuery = useUpvotes({ answerId });

  const upvoteCountText =
    upvoteCount === 1 ? "1 Upvote" : `${upvoteCount} Upvotes`;

  useEffect(() => {
    const fetchUpvoteCount = async () => {
      if (upvotesQuery.isFetched && !!upvotesQuery.data) {
        setUpvoteCount(upvotesQuery.data.toNumber());
      }
    };
    fetchUpvoteCount();
  }, [answerId, upvotesQuery.data, upvotesQuery.isFetched]);

  const handleClick = async () => {};

  return (
    <>
      <Text fontSize="sm" color="gray.500" mx={3}>
        {upvoteCountText}
      </Text>
      <Button
        {...props}
        isLoading={false}
        disabled={!account}
        onClick={handleClick}
      >
        <Icon as={FaArrowUp} />
      </Button>
    </>
  );
};

export default Upvote;
