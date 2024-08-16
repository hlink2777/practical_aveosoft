import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ size, xIsNext, squares, onPlay }) {
  const handleClick = (i) => {
    if (calculateWinner(squares, size) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares, size);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const rows = Array.from({ length: size }, (_, row) => (
    <div className="board-row" key={row}>
      {Array.from({ length: size }, (_, col) => (
        <Square
          key={row * size + col}
          value={squares[row * size + col]}
          onSquareClick={() => handleClick(row * size + col)}
        />
      ))}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const size = 4; 
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board size={size} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, size) {
  
  for (let i = 0; i < size; i++) {
    let rowStart = i * size;
    if (squares[rowStart] && squares.slice(rowStart, rowStart + size).every(value => value === squares[rowStart])) {
      return squares[rowStart];
    }
  }

 
  for (let i = 0; i < size; i++) {
    let colStart = i;
    let column = [];
    for (let j = 0; j < size; j++) {
      column.push(squares[colStart + j * size]);
    }
    if (column.every(value => value === column[0]) && column[0]) {
      return column[0];
    }
  }

  
  let diag1 = [];
  let diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(squares[i * size + i]);
    diag2.push(squares[(i + 1) * size - (i + 1)]);
  }
  if (diag1.every(value => value === diag1[0]) && diag1[0]) {
    return diag1[0];
  }
  if (diag2.every(value => value === diag2[0]) && diag2[0]) {
    return diag2[0];
  }

  return null;
}
