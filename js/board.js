/* ==========================================
   BLOCK BLAST PRO
   BOARD SYSTEM
========================================== */

const BOARD_SIZE = 8;

const boardElement = document.getElementById("board");

let board = [];

/* ==========================================
   CREATE BOARD DATA
========================================== */

function initializeBoard() {

    board = [];

    for (let row = 0; row < BOARD_SIZE; row++) {

        board[row] = [];

        for (let col = 0; col < BOARD_SIZE; col++) {

            board[row][col] = 0;

        }

    }

}

/* ==========================================
   CREATE BOARD HTML
========================================== */

function renderBoard() {

    boardElement.innerHTML = "";

    for (let row = 0; row < BOARD_SIZE; row++) {

        for (let col = 0; col < BOARD_SIZE; col++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            cell.dataset.row = row;

            cell.dataset.col = col;

            boardElement.appendChild(cell);

        }

    }

}

/* ==========================================
   UPDATE BOARD
========================================== */

 function updateBoard(){

    const cells=document.querySelectorAll(".cell");

    cells.forEach(cell=>{

        const row=Number(cell.dataset.row);
        const col=Number(cell.dataset.col);

        if(board[row][col]===1){

            cell.classList.add("filled");

        }else{

            cell.classList.remove("filled");

        }

    });

}

/* ==========================================
   START
========================================== */

function setupBoard() {

    initializeBoard();

    renderBoard();

    updateBoard();

}