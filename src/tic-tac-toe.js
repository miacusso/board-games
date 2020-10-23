import React from 'react';
import ReactDOM from 'react-dom';
import './tic-tac-toc.css';

function Square(props) {
    return (
        <button
            className={props.isWinner ? "square winner" : "square"}
            onClick={props.onClick}
        >
          {props.value}
        </button>
    );
}

function Restart(props) {
    return (<button onClick={props.onClick}>Restart</button>);
}

class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
            key={i}
            value={this.props.squares[i].value}
            isWinner={this.props.squares[i].isWinner}
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    //-- start new code
    renderRow(i) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(this.renderSquare(i));
            i++;
        }

        return (
            <div className="board-row" key={i}>
                {row}
            </div>
        );
    }

    render() {
        let board = [];
        for (let i = 0; i < 9; i = i + 3) {
            board.push(this.renderRow(i));
        }
        return (
            <div className="game-board">
                {board}
                <div className="reset"><Restart onClick={() => this.props.onRestart()} /></div>
            </div>
        );
    }
    //-- end new code

    /*
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
                <div className="reset"><Restart onClick={() => this.props.onRestart()} /></div>
            </div>
        );
    }
    */
}

class TicTacToe extends React.Component {
    constructor(props) {
        super(props);
        let squares = Array(9);
        for (let i = 0; i < 9; i++) {
            squares[i] = {value: null, isWinner: false};
        }
        this.state = {
            history: [{
                squares: squares,
                position: {
                    col: 0,
                    row: 0,
                },
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    initialize() {
        let squares = Array(9);
        for (let i = 0; i < 9; i++) {
            squares[i] = {value: null, isWinner: false};
        }
        this.setState({
            history: [{
                squares: squares,
                position: {
                    col: 0,
                    row: 0,
                },
            }],
            stepNumber: 0,
            xIsNext: true,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = JSON.parse(JSON.stringify(current.squares)); //current.squares.slice();
        if (calculateWinner(squares) || squares[i].value) {
            return ;
        }
        squares[i].value = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares:squares,
                position: convertSquareToColRow(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' - (' + step.position.col + ',' + step.position.row + ')'
                :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? "current" : ""}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            if (this.state.stepNumber < 9) {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            } else {
                status = 'Empate'
            }
        }

        return (
            <div className="game">
                <div className="game-name">TIC TAC TOE</div>
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    onRestart={() => this.initialize()}
                />
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<TicTacToe />, document.getElementById('tic-tac-toc'));

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
        if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
            squares[a].isWinner = true;
            squares[b].isWinner = true;
            squares[c].isWinner = true;
            return squares[a].value;
        }
    }
    return null;
  }

function convertSquareToColRow(square) {
    let col = 1;
    let row = 1;
    for (let i = 0; i < square; i++) {
        col++;
        if (col > 3) {
            col = 1;
            row++;
        }
    }
    return {col: col, row: row};
}