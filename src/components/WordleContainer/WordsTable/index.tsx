import { FC } from "react";
import { Grid } from "./components/Grid";

export interface IWordsTable {
  solution: any;
  guesses: any;
  currentGuess: any;
  isRevealing: boolean;
  currentRowClass: any;
}

const WordsTable: FC<IWordsTable> = ({
  currentGuess,
  currentRowClass,
  guesses,
  isRevealing,
  solution,
}) => {
  return (
    <div className="flex grow flex-col justify-center pb-6 short:pb-2">
      <Grid
        solution={solution}
        guesses={guesses}
        currentGuess={currentGuess}
        isRevealing={isRevealing}
        currentRowClassName={currentRowClass}
      />
    </div>
  );
};

export default WordsTable;
