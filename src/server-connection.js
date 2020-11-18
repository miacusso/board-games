var ServerConnection = class ServerConnection {

    constructor(game) {
        this.game = game;
        this.host = process.env.REACT_APP_DATABASE_HOST;
    }

    getResultTable() {
        let url = this.host + this.game + "/result-table";
        var response = new Promise(function (resolve) {
            fetch(url)
                .then(response => response.json())
                .then(wins => {resolve(wins)})
            ;
        });
        return response;
    }

    getPlayers() {
        let url = this.host + this.game + "/players";
        var response = new Promise(function (resolve) {
            fetch(url)
                .then(response => response.json())
                .then(players => {resolve(players)})
            ;
        });
        return response;
    }

    registerWinner(player) {
        let url = this.host + this.game + "/winner";
        fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Header': 'Content-Type',
                    'Access-Control-Request-Methods': 'POST'
                },
                body: JSON.stringify({winner: player}),
            }
        );
    }

    resetResults() {
        let url = this.host + this.game + "/delete-result-table";
        fetch(
            url,
            {
                method: 'DELETE',
                headers: {
                    'Access-Control-Request-Methods': 'DELETE'
                },
            }
        );
    }
}

export default ServerConnection;