
/* The pure JS session for the gameboard objec and related functions */
//import swal from "sweetalert";


function createGameBoard() {
    let gameBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];


    const cellDictionary = {
        c1: [0, 0],
        c2: [0, 1],
        c3: [0, 2],
        c4: [1, 0],
        c5: [1, 1],
        c6: [1, 2],
        c7: [2, 0],
        c8: [2, 1],
        c9: [2, 2]
    };

    let endGame = false;
    let turn = true;
    let p1_score = 0;
    let p2_score = 0;
    let cellCount = 0;
    const reset = () => {
        setGameBoardZero();
    };

    // Function that sets the gameBoard cells to all 0s

    function setGameBoardZero() {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[0].length; j++) {
                gameBoard[i][j] = 0;
            }
        }
    }

    const setCell = (row, col) => {
        cellCount++; // increment cell count
        if (turn) {
            // check for win condition 
            if (winCondition(1, row, col)) {
                p1_score++;
                endGame = true;
                cellCount = 0;
                endGameColor("black");
                alertMessage("Player 1 won!")
            };
        }
        else {
            // check for win condition
            if (winCondition(2, row, col)) {
                p2_score++;
                endGame = true;
                cellCount = 0;
                endGameColor("black");
                alertMessage("Player 2 won!")
            };
        }
        if (cellCount === 9) {
            cellCount = 0;
            endGame = true;
            endGameColor("black");
            alertMessage("Game ends in a Draw!");
        }
    };

    const changeTurn = () => {
        turn = !turn;
    };


    const game = {
        reset,
        get getTurn() {
            return turn;
        },
        get getDict() {
            return cellDictionary;
        },
        get playerOneScore() {
            return p1_score;
        },
        set playerOneScore(value) {
            p1_score = value;
        },
        get playerTwoScore() {
            return p2_score;
        },
        set playerTwoScore(value) {
            p2_score = value;
        },
        get gameBoard() {
            return gameBoard;
        },
        get endGame() {
            return endGame;
        },
        set endGame(value) {
            endGame = value;
        },
        setCell,
        changeTurn
    };

    // private internal function to check the win condition
    function winCondition(player, row, col) {
        gameBoard[row][col] = player;
        // check horizontal first
        switch (col) {
            case 0:
                if (gameBoard[row][col + 1] === player && gameBoard[row][col + 2] === player) return true;
                break;
            case 1:
                if (gameBoard[row][col - 1] === player && gameBoard[row][col + 1] === player) return true;
                break;
            case 2:
                if (gameBoard[row][col - 1] === player && gameBoard[row][col - 2] === player) return true;
                break;
            default:
                break;
        }
        // check vertical 
        switch (row) {
            case 0:
                if (gameBoard[row + 1][col] === player && gameBoard[row + 2][col] === player) return true;
                break;
            case 1:
                if (gameBoard[row - 1][col] === player && gameBoard[row + 1][col] === player) return true;
                break;
            case 2:
                if (gameBoard[row - 1][col] === player && gameBoard[row - 2][col] === player) return true;
                break;
            default:
                break;
        }
        // check diagonal
        if (row === 1 && col === 1) {
            return (gameBoard[row - 1][col - 1] === player && gameBoard[row + 1][col - 1] === player) ||
                (gameBoard[row + 1][col - 1] === player && gameBoard[row - 1][col + 1]) === player;
        }
        else if (row === 2 && col === 2) {
            return gameBoard[row - 1][col - 1] === player && gameBoard[row - 2][col - 2] === player;
        }
        else if (row === 0 && col === 0) {
            return gameBoard[row + 1][col + 1] === player && gameBoard[row + 2][col + 2] === player;
        }
        else if (row === 2 && col === 1) {
            return gameBoard[row - 1][col + 1] === player && gameBoard[row - 2][col + 2] === player;
        }
        else if (row === 0 && col === 2) {
            return gameBoard[row + 1][col - 1] === player && gameBoard[row + 2][col - 2] === player;
        }

        return false;
    }

    return game;
}


/** The UI code **/
//const startButton = document.getElementById("start_button");
let theGame;
function startTheGame() {
    // will start the game
    const startButton = document.getElementById("start_button");
    startButton.style.color = "orange";
    startButton.style.backgroundColor = "blue";
    theGame = createGameBoard(1, 2);
    changeScore(theGame);
    changeUserUI(theGame.getTurn);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((c) => {
        c.addEventListener("click", (e) => {
            // call the function to update the cell and fill in the array
            if (!theGame.endGame) {
                let row = theGame.getDict[e.target.id][0];
                let col = theGame.getDict[e.target.id][1];
                if (theGame.gameBoard[row][col] === 0) {
                    theGame.setCell(row, col); // setting the cell here
                    changeCellUI(e.target.id, theGame.getTurn);
                    changeScore(theGame);
                    theGame.changeTurn(); // changing turn here
                    changeUserUI(theGame.getTurn);
                }
            }
        });
    });
}

function resetScore() {
    clearUI();
    endGameColor("white");
    theGame.reset();
}

function reset() {
    theGame.playerOneScore = 0;
    theGame.playerTwoScore = 0;
    theGame.reset();
    endGameColor("white");
    changeScore(theGame);
    clearUI();
}

function clearUI() {
    theGame.endGame = false;
    let cells = document.querySelectorAll(".cell");
    theGame.reset();
    cells.forEach((c) => {
        c.innerText = "";
    });
}

function changeScore(theGame) {
    let playerOne = document.getElementById("player1");
    let playerTwo = document.getElementById("player2");
    playerOne.innerText = theGame.playerOneScore;
    playerTwo.innerText = theGame.playerTwoScore
}

function changeUserUI(turn) {
    let player1 = document.getElementById("labelP1");
    let player2 = document.getElementById("labelP2");
    if (turn) {
        player1.style.scale = 1.2;
        player1.style.color = "red";
        player2.style.scale = 1;
        player2.style.color = "rebeccapurple";
    }
    else {
        player2.style.scale = 1.2;
        player2.style.color = "red";
        player1.style.scale = 1;
        player1.style.color = "rebeccapurple";
    }
}

// will use it later
function changeCellColor(id, turn) {

}

function changeCellUI(id, turn) {
    // Will handle changing color of the cell
    let theCell = document.getElementById(id);
    if (turn) {
        theCell.innerHTML = "&#9830";
        theCell.style.color = "darkblue";
    }
    else {
        theCell.innerHTML = "&#9829";
        theCell.style.color = "darkred";
    }
}

function endGameColor(color) {
    let cells = document.querySelectorAll(".cell");
    cells.forEach((c) => {
        c.style.backgroundColor = color;
    });
}

function alertMessage(message) {
    swal({
        title: message,
        text: "Game Ended!",
        icon: 'success',
        buttons: false,
        showConfirmButton: true, // Do not show the confirm button
        timer: 3000 // Disappear after 3 seconds
    });
}



/// Internal testing session ///
// let game = createGameBoard(1, 2);
// console.log(game.playerOneScore);
// theGame.setCell(2, 0, 0);
// theGame.setCell(2, 1, 1);
// theGame.setCell(1, 2, 2);
// theGame.setCell(2, 2, 2);
// theGame.cellCheck(2, 2);
// theGame.reset();
// theGame.cellCheck(2, 2);


