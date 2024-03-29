import * as React from "react"
import Avatar from "@davatar/react/dist/Image"
import { HStack, Stack, Flex, Badge, Spacer, Text } from "@chakra-ui/layout"
import TimeAgo from "react-timeago"
import { useProvider } from "wagmi"
import { Answer as AnswerStruct } from "../hooks/contracts/useForumContract"
import Username from "./Username"
import Upvote from "./Upvote"

interface AnswerProps {
  answer: AnswerStruct
  first?: boolean
}

const Answer: React.FunctionComponent<AnswerProps> = ({
  answer,
  first,
}: AnswerProps) => {
  const provider = useProvider()

  return (
    <HStack spacing={3} alignItems="start">
      <Avatar size={48} provider={provider} address={answer.creatorAddress} />
      <Stack
        spacing={1}
        flex={1}
        bg={first ? "purple.900" : "whiteAlpha.300"}
        rounded="md"
        p={3}
      >
        <Text color="white" fontSize="lg">
          {answer.message}
        </Text>
        <Flex alignItems="center" w="100%">
          <Badge
            borderRadius="full"
            px="5"
            color="purple.400"
            colorScheme="purple"
          >
            <Username address={answer.creatorAddress} />
          </Badge>
          <Text px="8px" fontSize="sm" color="gray.500">
            <TimeAgo date={answer.timestamp.toNumber() * 1000} />
          </Text>
          <Spacer />
          <Upvote
            creatorAddress={answer.creatorAddress}
            answerId={answer.answerId}
            alignSelf="flex-end"
            size="sm"
          ></Upvote>
        </Flex>
      </Stack>
    </HStack>
  )
}

export default Answer
