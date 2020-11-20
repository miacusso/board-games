import React from 'react';
import ReactDOM from 'react-dom';
import './tic-tac-toc.css';
import ScoreTable from './commons.js';
import ServerConnection from './server-connection.js';

function Square(props) {
    let winner = props.isWinner ? " winner" : "";
    let value = props.value ? props.value.name : "";
    return (
        <button
            className={"square " + winner}
            onClick={props.onClick}
        >
          {value.toUpperCase()}
        </button>
    );
}

function Restart(props) {
    return (<button onClick={props.onRestart}>Restart</button>);
}

class Board extends React.Component {

    renderSquare(squareId) {
      return (
        <Square
            key={squareId}
            value={this.props.squares[squareId].value}
            isWinner={this.props.squares[squareId].isWinner}
            onClick={() => this.props.onClick(squareId)}
        />
      );
    }

    renderRow(rowIndex) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(this.renderSquare(rowIndex));
            rowIndex++;
        }

        return (
            <div className="board-row" key={rowIndex}>
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
                <div className="reset"><Restart onRestart={() => this.props.onRestart()} /></div>
            </div>
        );
    }
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

            //FIXME: figure out how to avoid this default configuration. Use 'null' until the response from server arrives. See how to use a loader. Research promises.
            //players: null,
            players: [
                {
                    id: 1,
                    name: 'x',
                    game: 1
                },
                {
                    id: 2,
                    name: 'o',
                    game: 1
                }
            ],

            //wins: null,
            wins: {
                x: 0,
                o: 0,
            },
        };
    }

    nextPlayer() {
        return this.state.players[this.state.stepNumber % 2];
    }

    componentDidMount() {
        let server = new ServerConnection(1);
        server.getResultTable().then(wins => this.setState({wins: wins}));
        server.getPlayers().then(players => this.setState({players: players}));
    }

    registerWinner(player) {
        let server = new ServerConnection(1);
        server.registerWinner(player);
    }

    resetResults() {
        let server = new ServerConnection(1);
        server.resetResults();
    }

    handleRestart() {
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
        });
    }

    handleClick(squareId) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = JSON.parse(JSON.stringify(current.squares)); //current.squares.slice();
        if (calculateWinner(squares) || squares[squareId].value) {
            return ;
        }
        squares[squareId].value = this.nextPlayer();

        let wins = this.state.wins;
        const winner = calculateWinner(squares);

        if (winner) {
            wins[winner.name]++;
            this.registerWinner(winner);
        }

        this.setState({
            history: history.concat([{
                squares:squares,
                position: convertSquareToColRow(squareId),
            }]),
            stepNumber: history.length,
            wins: wins,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
        });
    }

    handleReset() {

        this.resetResults();

        const wins = {
            x: 0,
            o: 0,
        }

        this.setState({
            wins: wins,
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
            status = 'Winner: ' + winner.name.toUpperCase();
        } else {
            if (this.state.stepNumber < 9) {
                status = 'Next player: ' + this.nextPlayer().name.toUpperCase();
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
                    onRestart={() => this.handleRestart()}
                />
                <div className="game-info">
                    <div className="game-status">{status}</div>
                    <ScoreTable players={this.state.players} wins={this.state.wins} onReset={() => this.handleReset()} />
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
        if (squares[a].value && squares[b].value && squares[c].value &&
            squares[a].value.name === squares[b].value.name &&
            squares[a].value.name === squares[c].value.name) {
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