/* ==========================================
   BLOCK BLAST PRO
   VISUAL EFFECTS SYSTEM
========================================== */

"use strict";


const BlockBlastEffects = {


    /* ======================================
       BOARD FLASH
    ====================================== */

    boardFlash(){

        const board =
            document.getElementById("board");


        if(!board){

            return;

        }


        board.classList.remove(
            "board-flash"
        );


        void board.offsetWidth;


        board.classList.add(
            "board-flash"
        );


        setTimeout(() => {

            board.classList.remove(
                "board-flash"
            );

        }, 350);

    },


    /* ======================================
       SCORE POP
    ====================================== */

    scorePop(points){

        const scoreElement =
            document.getElementById("score");


        if(!scoreElement){

            return;

        }


        const rect =
            scoreElement.getBoundingClientRect();


        const popup =
            document.createElement("div");


        popup.className =
            "score-popup";


        popup.textContent =
            `+${points}`;


        popup.style.position =
            "fixed";


        popup.style.left =
            `${rect.left + rect.width / 2}px`;


        popup.style.top =
            `${rect.top}px`;


        popup.style.pointerEvents =
            "none";


        popup.style.zIndex =
            "10000";


        document.body.appendChild(
            popup
        );


        requestAnimationFrame(() => {

            popup.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            popup.remove();

        }, 700);

    },


    /* ======================================
       BLOCK SHAKE
    ====================================== */

    shakeBoard(){

        const board =
            document.getElementById("board");


        if(!board){

            return;

        }


        board.classList.remove(
            "board-shake"
        );


        void board.offsetWidth;


        board.classList.add(
            "board-shake"
        );


        setTimeout(() => {

            board.classList.remove(
                "board-shake"
            );

        }, 400);

    }

};


/* ==========================================
   GLOBAL ACCESS
========================================== */

window.BlockBlastEffects =
    BlockBlastEffects;