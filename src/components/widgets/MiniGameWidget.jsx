import { useState, useEffect, useCallback } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  const playerXColor = "text-blue-500";
  const playerOColor = "text-pink-500";
  const colorClass = value === "X" ? playerXColor : playerOColor;
  const winningClass = isWinningSquare ? "bg-green-500/30" : "bg-gray-200/70 dark:bg-gray-700/60";

  return (
    <button
      onClick={onSquareClick}
      className={`relative w-full aspect-square flex items-center justify-center rounded-lg text-5xl font-bold transition-all duration-150 ease-in-out hover:bg-gray-300/80 dark:hover:bg-gray-600/80 ${winningClass}`}
    >
      <span className={`transition-colors ${colorClass}`}>{value}</span>
      {isWinningSquare && (
        <div className="absolute inset-0 rounded-lg ring-4 ring-green-500 animate-pulse"></div>
      )}
    </button>
  );
}

function GameStatus({ winner, xIsNext, isDraw }) {
  let statusContent;
  if (winner) {
    statusContent = (
      <>
        <span className="text-2xl mr-2">🏆</span> Winner: {winner}!
      </>
    );
  } else if (isDraw) {
    statusContent = "It's a Draw!";
  } else {
    statusContent = (
      <>
        Next:{" "}
        <span className={xIsNext ? "text-blue-500" : "text-pink-500"}>{xIsNext ? " X" : " O"}</span>
      </>
    );
  }

  return (
    <div className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100 h-8 flex items-center justify-center">
      {statusContent}
    </div>
  );
}

function Board({ squares, onPlay, winDetails }) {
  function handleClick(i) {
    if (winDetails?.winner || squares[i]) return;
    onPlay(i);
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2 bg-gray-300/50 dark:bg-gray-900/50 rounded-xl shadow-inner">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onSquareClick={() => handleClick(i)}
          isWinningSquare={winDetails?.line.includes(i)}
        />
      ))}
    </div>
  );
}

function GameModeSelector({ onSelectMode }) {
  const buttonStyle =
    "flex items-center gap-3 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-transform duration-200 hover:scale-105";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-4 p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
        <svg
          className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 3h2v18H6zM16 3h2v18h-2zM3 6h18v2H3zM3 16h18v2H3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Tic-Tac-Toe</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => onSelectMode("pvp")} className={buttonStyle}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8zm13 8H5a3 3 0 0 0-3 3v2h22v-2a3 3 0 0 0-3-3z"></path>
          </svg>
          Player vs. Player
        </button>
        <button
          onClick={() => onSelectMode("pvc")}
          className={`${buttonStyle} bg-green-600 hover:bg-green-700`}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="5" width="14" height="14" rx="1" />
            <path d="M9 9h6v6H9z" />
            <path d="M3 10h2M3 14h2M10 3v2M14 3v2M21 10h-2M21 14h-2M10 21v-2M14 21v-2" />
          </svg>
          Player vs. Computer
        </button>
      </div>
    </div>
  );
}

export default function MiniGameWidget() {
  const [gameMode, setGameMode] = useState(null);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winDetails = calculateWinner(currentSquares);
  const isDraw = !winDetails && currentSquares.every(Boolean);
  const isGameOver = winDetails || isDraw;

  const handlePlay = useCallback(
    (i) => {
      if (winDetails || currentSquares[i]) return;
      const nextSquares = currentSquares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    },
    [history, currentMove, xIsNext, winDetails, currentSquares]
  );

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  useEffect(() => {
    if (!xIsNext && gameMode === "pvc" && !isGameOver) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(currentSquares);
        if (bestMove !== -1) handlePlay(bestMove);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, gameMode, isGameOver, currentSquares, handlePlay]);

  if (!gameMode) {
    return <GameModeSelector onSelectMode={setGameMode} />;
  }

  const moves = history.map((_squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move} className="mb-1.5">
        <button
          onClick={() => setCurrentMove(move)}
          disabled={move === currentMove}
          className="w-full text-sm font-semibold p-2 rounded-lg transition-colors disabled:opacity-100 disabled:ring-2 disabled:ring-blue-500 disabled:bg-white dark:disabled:bg-gray-800 bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-700/80 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-6 p-2">
      <div className="w-full max-w-xs mx-auto">
        <GameStatus winner={winDetails?.winner} xIsNext={xIsNext} isDraw={isDraw} />
        <Board squares={currentSquares} onPlay={handlePlay} winDetails={winDetails} />
        <div className="mt-4 flex gap-2 justify-center">
          {isGameOver && (
            <button
              onClick={resetGame}
              className="font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Play Again
            </button>
          )}
          <button
            onClick={() => {
              resetGame();
              setGameMode(null);
            }}
            className="font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 bg-gray-500 hover:bg-gray-600 text-white"
          >
            Change Mode
          </button>
        </div>
      </div>
      <div className="game-info w-full lg:w-48 mt-4 lg:mt-0">
        <h3 className="text-base font-bold mb-2 text-center lg:text-left text-gray-800 dark:text-gray-100">
          History
        </h3>
        <ol className="p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg max-h-60 overflow-y-auto">
          {moves}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function findBestMove(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const squaresCopy = squares.slice();
      squaresCopy[i] = "O";
      if (calculateWinner(squaresCopy)?.winner === "O") return i;
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const squaresCopy = squares.slice();
      squaresCopy[i] = "X";
      if (calculateWinner(squaresCopy)?.winner === "X") return i;
    }
  }
  if (!squares[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !squares[i]);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter((i) => !squares[i]);
  if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
  return squares.findIndex((sq) => sq === null);
}
