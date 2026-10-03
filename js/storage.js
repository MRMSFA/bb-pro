/* ==========================================
   BLOCK BLAST PRO
   STORAGE SYSTEM
========================================== */

"use strict";


const STORAGE_KEYS = {
    GAME: "blockblast_save",
    BEST_SCORE: "blockblast_best",
    SOUND: "blockblast_sound"
};


/* ==========================================
   SAVE GAME
========================================== */

function saveGame(data){

    try{

        localStorage.setItem(
            STORAGE_KEYS.GAME,
            JSON.stringify(data)
        );

        return true;

    }catch(error){

        console.warn(
            "Block Blast: Could not save game.",
            error
        );

        return false;

    }

}


/* ==========================================
   LOAD GAME
========================================== */

function loadGame(){

    try{

        const data =
            localStorage.getItem(
                STORAGE_KEYS.GAME
            );

        if(!data){

            return null;

        }

        return JSON.parse(data);

    }catch(error){

        console.warn(
            "Block Blast: Could not load game.",
            error
        );

        return null;

    }

}


/* ==========================================
   DELETE SAVED GAME
========================================== */

function deleteSavedGame(){

    try{

        localStorage.removeItem(
            STORAGE_KEYS.GAME
        );

        return true;

    }catch(error){

        return false;

    }

}