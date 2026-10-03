"use strict";

/* =========================================================
   BLOCK BLAST PRO
   MAIN GAME INITIALIZER
========================================================= */

window.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       INITIALIZE UI
    ===================================================== */

    if (
        window.BlockBlastUI &&
        typeof window.BlockBlastUI.init === "function"
    ) {
        window.BlockBlastUI.init();
    }


    /* =====================================================
       LOADING ELEMENTS
    ===================================================== */

    const progress =
        document.getElementById("loading-progress");

    const percent =
        document.getElementById("loading-percent");

    const loadingText =
        document.getElementById("loading-text");


    /* =====================================================
       LOADING STEPS
    ===================================================== */

    const loadingSteps = [
        {
            value: 20,
            text: "LOADING CORE"
        },
        {
            value: 40,
            text: "BUILDING BOARD"
        },
        {
            value: 60,
            text: "LOADING BLOCKS"
        },
        {
            value: 80,
            text: "INITIALIZING SYSTEM"
        },
        {
            value: 100,
            text: "READY TO PLAY"
        }
    ];


    let step = 0;


    const progressTimer =
        setInterval(() => {

            if (
                step >= loadingSteps.length
            ) {
                clearInterval(progressTimer);
                return;
            }


            const current =
                loadingSteps[step];


            if (progress) {
                progress.style.width =
                    current.value + "%";
            }


            if (percent) {
                percent.textContent =
                    current.value + "%";
            }


            if (loadingText) {
                loadingText.textContent =
                    current.text;
            }


            step++;

        }, 140);


    /* =====================================================
       FINISH LOADING
    ===================================================== */

    setTimeout(() => {

        if (
            window.BlockBlastUI &&
            typeof window.BlockBlastUI.hideLoading ===
            "function"
        ) {
            window.BlockBlastUI.hideLoading();
        }


        setTimeout(() => {

            if (
                window.BlockBlastUI &&
                typeof window.BlockBlastUI.showMainMenu ===
                "function"
            ) {
                window.BlockBlastUI.showMainMenu();
            }

        }, 300);

    }, 950);


    /* =====================================================
       GLOBAL FIRST USER INTERACTION
       Helps browsers unlock audio.
    ===================================================== */

    const unlockAudio = () => {

        if (
            window.BlockBlastSound &&
            typeof window.BlockBlastSound.resume ===
            "function"
        ) {
            window.BlockBlastSound.resume();
        }

    };


    document.addEventListener(
        "pointerdown",
        unlockAudio,
        {
            once: true,
            passive: true
        }
    );

});