/* ==========================================
   BLOCK BLAST PRO
   GAME LOGIC
========================================== */


/* ==========================================
   RESET GAME
========================================== */

function resetGame(){

    if(typeof resetScore === "function"){
        resetScore();
    }

    initializeBoard();

    renderBoard();

    updateBoard();

    generateBlocks();

    enableDragging();

}


/* ==========================================
   CLEAR COMPLETE LINES
========================================== */

function updateGame(){

    const rowsToClear = [];
    const columnsToClear = [];


    /* ======================================
       CHECK ROWS
    ====================================== */

    for(let row = 0; row < BOARD_SIZE; row++){

        let full = true;

        for(let col = 0; col < BOARD_SIZE; col++){

            if(board[row][col] !== 1){

                full = false;
                break;

            }

        }

        if(full){

            rowsToClear.push(row);

        }

    }


    /* ======================================
       CHECK COLUMNS
    ====================================== */

    for(let col = 0; col < BOARD_SIZE; col++){

        let full = true;

        for(let row = 0; row < BOARD_SIZE; row++){

            if(board[row][col] !== 1){

                full = false;
                break;

            }

        }

        if(full){

            columnsToClear.push(col);

        }

    }


    /* ======================================
       TOTAL LINES
    ====================================== */

    const totalLines =
        rowsToClear.length +
        columnsToClear.length;


    /* ======================================
       NO LINE
    ====================================== */

    if(totalLines === 0){

        updateBoard();

        return;

    }


    /* ======================================
       CLEAR ROWS
    ====================================== */

    rowsToClear.forEach(row => {

        for(let col = 0; col < BOARD_SIZE; col++){

            board[row][col] = 0;

        }

    });


    /* ======================================
       CLEAR COLUMNS
    ====================================== */

    columnsToClear.forEach(col => {

        for(let row = 0; row < BOARD_SIZE; row++){

            board[row][col] = 0;

        }

    });


    /* ======================================
       SCORE
    ====================================== */

    let points = totalLines * 100;


    /* BONUS FOR MULTIPLE LINES */

    if(totalLines >= 2){

        points += (totalLines - 1) * 50;

    }


    if(typeof addScore === "function"){

        addScore(points);

    }


    /* ======================================
       SOUND
    ====================================== */

    if(
        window.BlockBlastSound &&
        typeof window.BlockBlastSound.lineClear === "function"
    ){

        if(totalLines >= 2){

            if(
                typeof window.BlockBlastSound.combo === "function"
            ){

                window.BlockBlastSound.combo();

            }

        }else{

            window.BlockBlastSound.lineClear();

        }

    }


    /* ======================================
       UPDATE BOARD
    ====================================== */

    updateBoard();

}