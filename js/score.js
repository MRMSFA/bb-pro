"use strict";


let score = 0;
let bestScore = 0;


/* ==========================================
   HIGH SCORE STATE
========================================== */

let newHighScore = false;


/* ==========================================
   LOAD BEST SCORE
========================================== */

function loadBestScore(){

    try{

        const saved =
            localStorage.getItem(
                "blockblast_best"
            );

        if(saved !== null){

            const value =
                Number(saved);

            if(
                Number.isFinite(value) &&
                value >= 0
            ){

                bestScore =
                    value;

            }

        }

    }catch(error){

        console.warn(
            "Block Blast: Best score could not be loaded.",
            error
        );

    }


    updateScoreUI();

}


/* ==========================================
   UPDATE SCORE UI
========================================== */

function updateScoreUI(){

    const scoreElement =
        document.getElementById("score");

    const bestElement =
        document.getElementById("best-score");


    if(scoreElement){

        scoreElement.textContent =
            score.toLocaleString();

    }


    if(bestElement){

        bestElement.textContent =
            bestScore.toLocaleString();

    }

}


/* ==========================================
   ADD SCORE
========================================== */

function addScore(points){

    points =
        Number(points);


    if(
        !Number.isFinite(points) ||
        points <= 0
    ){

        return;

    }


    const previousBest =
        bestScore;


    score +=
        Math.floor(points);


    /*
        Detect new record BEFORE
        updating the saved best score.
    */

    if(
        score > previousBest
    ){

        if(!newHighScore){

            newHighScore =
                true;


            /*
                Special high-score sound.
            */

            if(
                window.BlockBlastSound &&
                typeof window.BlockBlastSound.newHighScore ===
                "function"
            ){

                window.BlockBlastSound.newHighScore();

            }

        }


        bestScore =
            score;


        try{

            localStorage.setItem(
                "blockblast_best",
                String(bestScore)
            );

        }catch(error){

            console.warn(
                "Block Blast: Could not save best score.",
                error
            );

        }

    }


    updateScoreUI();


    if(
        window.BlockBlastSound &&
        typeof window.BlockBlastSound.score ===
        "function"
    ){

        window.BlockBlastSound.score();

    }

}


/* ==========================================
   RESET SCORE
========================================== */

function resetScore(){

    score =
        0;

    newHighScore =
        false;

    updateScoreUI();

}


/* ==========================================
   GETTERS
========================================== */

function getScore(){

    return score;

}


function getBestScore(){

    return bestScore;

}


function isNewHighScore(){

    return newHighScore;

}


/* ==========================================
   INITIAL LOAD
========================================== */

loadBestScore();