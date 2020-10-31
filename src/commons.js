import React from 'react';

function Reset(props) {
    return (<button onClick={props.onReset}>Reset</button>);
}

var ScoreTable = class ScoreTable extends React.Component {

    renderRow(row) {
        return (
            <div key={row} className="score-table-row">
                <div className="score-table-title">{capitalize(this.props.players[row].name)}</div>
                <div className="score-table-result">{this.props.wins[this.props.players[row].name]}</div>
            </div>
        );
    }

    render() {
        let table = [];
        for (let i = 0; i < this.props.players.length; i++) {
            table.push(this.renderRow(i));
        }
        return (
            <div className="score-table">
                <div>SCORE TABLE</div>
                {table}
                <div className="reset"><Reset onReset={() => this.props.onReset()} /></div>
            </div>
        );
    }
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export default ScoreTable;