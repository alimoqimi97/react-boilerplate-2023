import { FC, useState } from "react";
import { Keyboard } from "../components/WordleContainer/KeyBoard";

import {
  findFirstUnusedReveal,
  getIsLatestGame,
  isWinningWord,
  isWordInWordList,
  solution,
  unicodeLength,
} from "../lib/words";
import { loadGameStateFromLocalStorage } from "../lib/localStorage";
import { MAX_CHALLENGES, REVEAL_TIME_MS } from "../constants/settings";
import {
  CORRECT_WORD_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
} from "../constants/strings";
import ToastNotify from "../components/ToastNotify";
import GraphemeSplitter from "grapheme-splitter";
import { addStatsForCompletedGame, loadStats } from "../lib/stats";
import WordsTable from "../components/WordleContainer/WordsTable";
import styles from "./styles.module.scss";

const useKeyBoard = () => {
  const isLatestGame = getIsLatestGame();
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState("");
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame);
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      ToastNotify(CORRECT_WORD_MESSAGE(solution));
    }
    return loaded.guesses;
  });
  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem("gameMode")
      ? localStorage.getItem("gameMode") === "hard"
      : false
  );

  const [isRevealing, setIsRevealing] = useState(false);

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join("")
    );
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass("jiggle");
      return ToastNotify(NOT_ENOUGH_LETTERS_MESSAGE);
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass("jiggle");
      return ToastNotify(WORD_NOT_FOUND_MESSAGE);
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setCurrentRowClass("jiggle");
        return ToastNotify(firstMissingReveal);
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * solution.length);

    const winningWord = isWinningWord(currentGuess);

    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length));
        }
        return setIsGameWon(true);
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        }
        setIsGameLost(true);
        ToastNotify(CORRECT_WORD_MESSAGE(solution));
      }
    }
  };

  return {
    onChar,
    onDelete,
    onEnter,
    isRevealing,
    guesses,
    currentGuess,
    currentRowClass,
  };
};

const WordleContainer: FC = () => {
  const {
    onChar,
    onDelete,
    onEnter,
    guesses,
    isRevealing,
    currentGuess,
    currentRowClass,
  } = useKeyBoard();

  return (
    <section className={styles["wordle-container"]}>
      <WordsTable
        solution={solution}
        guesses={guesses}
        currentGuess={currentGuess}
        isRevealing={isRevealing}
        currentRowClass={currentRowClass}
      />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        solution={solution}
        guesses={guesses}
        isRevealing={isRevealing}
      />
    </section>
  );
};

export default WordleContainer;
