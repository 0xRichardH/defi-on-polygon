import * as React from "react"
import { BigNumber } from "ethers"
import { Answer as AnswerStruct } from "../hooks/contracts/useForumContract"
import useAnswers from "../hooks/useAnswers"
import { Box, Center, Spinner, Stack } from "@chakra-ui/react"
import Answer from "./Answer"
import AnswerEditor from "./AnswerEditor"
import useEvents from "../hooks/useEvents"

interface AnswersProps {
  questionId: BigNumber
}

const Answers: React.FunctionComponent<AnswersProps> = ({
  questionId,
}: AnswersProps) => {
  const [sortedAnswers, setSortedAnswers] = React.useState<AnswerStruct[]>([])
  const answersQuery = useAnswers({ questionId })

  useEvents({ questionId })

  React.useEffect(() => {
    if (answersQuery.data) {
      const sortAnswers = answersQuery.data.sort((a, b) =>
        a.upvotes > b.upvotes ? -1 : 1
      )
      setSortedAnswers(sortAnswers)
    }
  }, [answersQuery.data, answersQuery.isFetched])

  return (
    <Box>
      {answersQuery.isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}
      <Stack spacing={2}>
        {sortedAnswers.map((answer, i) => (
          <Answer
            key={answer.answerId.toNumber()}
            answer={answer}
            first={i === 0 && answer.upvotes.toNumber() !== 0}
          />
        ))}
        {answersQuery.isFetched && <AnswerEditor questionId={questionId} />}
      </Stack>
    </Box>
  )
}

export default Answers
