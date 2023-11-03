import { getGuessStatuses } from '../../../../../lib/statuses'
import { unicodeSplit } from '../../../../../lib/words'
import { Cell } from '../Cell'

type Props = {
  solution: string
  guess: string
  isRevealing?: boolean
}

export const CompletedRow = ({ solution, guess, isRevealing }: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="mb-1 flex justify-center">
      {splitGuess.map((letter: any, index: number) => (
        <Cell
          key={index}
          value={letter}
          status={statuses[index]}
          position={index}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}