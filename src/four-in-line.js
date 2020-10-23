import React from 'react';
import ReactDOM from 'react-dom';
import './four-in-line.css';

class Cell extends React.Component {
    render () {
        let value = "";
        if (this.props.value) {
            if (this.props.value === "Red") {
                value = "red";
            } else {
                value = "blue";
            }
        }
        let winner = this.props.isWinner ? " winner" : "";
        return (<div className={"cell " + value + winner}></div>);
    }
}

function Restart(props) {
    return (<button onClick={props.onRestart}>Restart</button>);
}

function Reset(props) {
    return (<button onClick={props.onReset}>Reset</button>);
}

class Grid extends React.Component {
    renderColumn(i) {
        let columns = [];
        for (let j = 0; j < 6; j++) {
            columns.push(<Cell key={i} value={this.props.cells[i].value} isWinner={this.props.cells[i].isWinner} />);
            i++;
        }
        const colNumber = (i/6) - 1;
        return (
            <div key={colNumber} className="column" onClick={() => this.props.onClick(colNumber)}>{columns}</div>
        );
    }

    render() {
        let grid = [];
        for (let i = 0; i < 42; i = i + 6) {
            grid.push(this.renderColumn(i));
        }
        return (
            <div className="game-board">
                {grid}
                <div className="reset"><Restart onRestart={() => this.props.onRestart()} /></div>
            </div>
        );
    }
}

class ScoreTable extends React.Component {
    render() {
        return (
            <div className="score-table">
                <div>SCORE TABLE</div>
                <div className="score-table-title">Red</div>
                <div className="score-table-title">Blue</div>
                <div className="score-table-result">{this.props.wins.red}</div>
                <div className="score-table-result">{this.props.wins.blue}</div>
            </div>
        );
    }
}

class FourInLine extends React.Component {
    constructor(props) {
        super(props);
        let cells = Array(42);
        for (let i = 0; i < 42; i++) {
            cells[i] = {value: null, isWinner: false};
        }
        this.state = {
            cells: cells,
            stepNumber: 0,
            redIsNext: true,
            wins: {
                red: 0,
                blue: 0,
            },
        };
    }

    handleRestart () {
        let cells = Array(42);
        for (let i = 0; i < 42; i++) {
            cells[i] = {value: null, isWinner: false};
        }
        this.setState({
            cells: cells,
            stepNumber: 0,
            redIsNext: true,
        });
    }

    handleClick(colNumber) {
        const cells = this.state.cells.slice();
        if (calculateWinner(cells)) {
            return ;
        }
        let start = colNumber * 6;
        let offset = 0;
        while (offset < 6 && !cells[start+offset].value) {
            offset++;
        }
        if (start+offset-1 >= start) {
            cells[start+offset-1].value = this.state.redIsNext ? "Red" : "Blue";

            let wins = {
                red: this.state.wins.red,
                blue: this.state.wins.blue,
            }
            const winner = calculateWinner(cells);

            if (winner) {
                if (winner === "Red") {
                    wins.red++;
                } else {
                    wins.blue++;
                }
            }

            this.setState({
                cells: cells,
                stepNumber: this.state.stepNumber + 1,
                redIsNext: !this.state.redIsNext,
                wins: wins,
            });
        }
    }

    handleReset() {
        const wins = {
            red: 0,
            blue: 0,
        }
        this.setState({
            wins: wins,
        });
    }

    render() {
        const winner = calculateWinner(this.state.cells);
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            if (this.state.stepNumber < 42) {
                status = 'Next player: ' + (this.state.redIsNext ? 'Red' : 'Blue');
            } else {
                status = 'Empate';
            }
        }

        return (
            <div className="game">
                <div className="game-name">FOUR IN LINE</div>
                <Grid onClick={(i) => this.handleClick(i)} onRestart={() => this.handleRestart()} cells={this.state.cells} />
                <div className="game-info">
                    <div className="game-status">{status}</div>
                    <ScoreTable wins={this.state.wins} />
                    <div className="reset"><Reset onReset={() => this.handleReset()} /></div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<FourInLine />, document.getElementById('four-in-line'));

function calculateWinner(cells) {
    const lines = [
        // Vertical:
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],

        [6, 7, 8, 9],
        [7, 8, 9, 10],
        [8, 9, 10, 11],

        [12, 13, 14, 15],
        [13, 14, 15, 16],
        [14, 15, 16, 17],

        [18, 19, 20, 21],
        [19, 20, 21, 22],
        [20, 21, 22, 23],

        [24, 25, 26, 27],
        [25, 26, 27, 28],
        [26, 27, 28, 29],

        [30, 31, 32, 33],
        [31, 32, 33, 34],
        [32, 33, 34, 35],

        [36, 37, 38, 39],
        [37, 38, 39, 40],
        [38, 39, 40, 41],

        //Horizontal:
        [0, 6, 12, 18],
        [6, 12, 18, 24],
        [12, 18, 24, 30],
        [18, 24, 30, 36],

        [1, 7, 13, 19],
        [7, 13, 19, 25],
        [13, 19, 25, 31],
        [19, 25, 31, 37],

        [2, 8, 14, 20],
        [8, 14, 20, 26],
        [14, 20, 26, 32],
        [20, 26, 32, 38],

        [3, 9, 15, 21],
        [9, 15, 21, 27],
        [15, 21, 27, 33],
        [21, 27, 33, 39],

        [4, 10, 16, 22],
        [10, 16, 22, 28],
        [16, 22, 28, 34],
        [22, 28, 34, 40],

        [5, 11, 17, 23],
        [11, 17, 23, 29],
        [17, 23, 29, 35],
        [23, 29, 35, 41],

        //Cross (Up):
        [3, 8, 13, 18],
        [4, 9, 14, 19],
        [9, 14, 19, 24],
        [5, 10, 15, 20],
        [10, 15, 20, 25],
        [15, 20, 25, 30],
        [11, 16, 21, 26],
        [16, 21, 26, 31],
        [21, 26, 31, 36],
        [17, 22, 27, 32],
        [22, 27, 32, 37],
        [23, 28, 33, 38],

        //Cross (Down):
        [2, 9, 16, 23],
        [1, 8, 15, 22],
        [8, 15, 22, 29],
        [0, 7, 14, 21],
        [7, 14, 21, 28],
        [14, 21, 28, 35],
        [6, 13, 20, 27],
        [13, 20, 27, 34],
        [20, 27, 34, 41],
        [12, 19, 26, 33],
        [19, 26, 33, 40],
        [18, 25, 32, 39]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (cells[a].value &&
            cells[a].value === cells[b].value &&
            cells[a].value === cells[c].value &&
            cells[a].value === cells[d].value) {
                cells[a].isWinner = true;
                cells[b].isWinner = true;
                cells[c].isWinner = true;
                cells[d].isWinner = true;
                return cells[a].value;
        }
    }
    return null;
}