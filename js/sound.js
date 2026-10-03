"use strict";

/* =========================================================
   BLOCK BLAST PRO
   SOUND + BACKGROUND MUSIC SYSTEM
========================================================= */

const BlockBlastSound = {

    context: null,
    masterGain: null,

    enabled: true,

    volume: 0.42,

    musicEnabled: true,

    musicVolume: 0.28,

    musicAudio: null,

    customMusicURL: null,

    initialized: false,


    /* =====================================================
       INIT AUDIO
    ===================================================== */

    init() {

        if (this.context) {
            return;
        }


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        try {

            this.context =
                new AudioContext();


            this.masterGain =
                this.context.createGain();


            this.masterGain.gain.value =
                this.enabled
                    ? this.volume
                    : 0;


            this.masterGain.connect(
                this.context.destination
            );


            this.initialized = true;


        } catch (error) {

            console.warn(
                "Audio unavailable.",
                error
            );

        }

    },


    /* =====================================================
       RESUME
    ===================================================== */

    resume() {

        this.init();


        if (
            this.context &&
            this.context.state ===
            "suspended"
        ) {

            this.context.resume();

        }

    },


    /* =====================================================
       SFX ENABLE
    ===================================================== */

    setEnabled(enabled) {

        this.enabled =
            Boolean(enabled);


        this.init();


        if (
            this.context &&
            this.masterGain
        ) {

            this.masterGain.gain.setTargetAtTime(

                this.enabled
                    ? this.volume
                    : 0,

                this.context.currentTime,

                0.04

            );

        }

    },


    /* =====================================================
       SFX VOLUME
    ===================================================== */

    setVolume(volume) {

        volume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        this.volume =
            volume;


        this.init();


        if (
            this.context &&
            this.masterGain
        ) {

            this.masterGain.gain.setTargetAtTime(

                this.enabled
                    ? volume
                    : 0,

                this.context.currentTime,

                0.04

            );

        }

    },


    /* =====================================================
       TONE
    ===================================================== */

    tone(
        frequency,
        duration,
        type = "sine",
        volume = 0.12,
        slideTo = null
    ) {

        if (!this.enabled) {
            return;
        }


        this.resume();


        if (
            !this.context ||
            !this.masterGain
        ) {
            return;
        }


        const now =
            this.context.currentTime;


        const oscillator =
            this.context.createOscillator();


        const gain =
            this.context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        if (slideTo !== null) {

            oscillator.frequency.exponentialRampToValueAtTime(
                Math.max(1, slideTo),
                now + duration
            );

        }


        gain.gain.setValueAtTime(
            0.001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            Math.max(
                0.001,
                volume
            ),
            now + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.masterGain
        );


        oscillator.start(
            now
        );


        oscillator.stop(
            now + duration + 0.03
        );

    },


    /* =====================================================
       PICKUP
    ===================================================== */

    pickup() {

        this.tone(
            420,
            0.08,
            "sine",
            0.07,
            580
        );

    },


    /* =====================================================
       PLACE
    ===================================================== */

    place() {

        this.tone(
            230,
            0.10,
            "triangle",
            0.10,
            150
        );


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    360,
                    0.08,
                    "sine",
                    0.055
                );

            }

        }, 35);

    },


    /* =====================================================
       INVALID
    ===================================================== */

    invalid() {

        this.tone(
            170,
            0.14,
            "triangle",
            0.055,
            120
        );

    },


    /* =====================================================
       LINE CLEAR
    ===================================================== */

    lineClear() {

        this.tone(
            520,
            0.15,
            "sine",
            0.08
        );


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    660,
                    0.17,
                    "sine",
                    0.085
                );

            }

        }, 75);


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    880,
                    0.22,
                    "sine",
                    0.075
                );

            }

        }, 150);

    },


    /* =====================================================
       COMBO
    ===================================================== */

    combo() {

        const notes = [
            440,
            554.37,
            659.25,
            880
        ];


        notes.forEach(
            (frequency, index) => {

                setTimeout(() => {

                    if (this.enabled) {

                        this.tone(
                            frequency,
                            0.18,
                            "sine",
                            0.085
                        );

                    }

                }, index * 65);

            }
        );

    },


    /* =====================================================
       SCORE
    ===================================================== */

    score() {

        this.tone(
            760,
            0.08,
            "sine",
            0.035,
            920
        );

    },


    /* =====================================================
       NEW BLOCKS
    ===================================================== */

    newBlocks() {

        this.tone(
            330,
            0.13,
            "sine",
            0.045
        );


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    440,
                    0.14,
                    "sine",
                    0.05
                );

            }

        }, 75);


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    554.37,
                    0.18,
                    "sine",
                    0.055
                );

            }

        }, 150);

    },


    /* =====================================================
       CLICK
    ===================================================== */

    click() {

        this.tone(
            420,
            0.06,
            "sine",
            0.045,
            500
        );

    },


    /* =====================================================
       NEW HIGH SCORE
    ===================================================== */

    newHighScore() {

        const notes = [
            523.25,
            659.25,
            783.99,
            1046.50,
            1318.51
        ];


        notes.forEach(
            (frequency, index) => {

                setTimeout(() => {

                    if (this.enabled) {

                        this.tone(
                            frequency,
                            0.24,
                            "sine",
                            0.10
                        );

                    }

                }, index * 90);

            }
        );

    },


    /* =====================================================
       GAME OVER
    ===================================================== */

    gameOver() {

        this.tone(
            330,
            0.25,
            "triangle",
            0.085,
            250
        );


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    250,
                    0.30,
                    "triangle",
                    0.09,
                    185
                );

            }

        }, 160);


        setTimeout(() => {

            if (this.enabled) {

                this.tone(
                    185,
                    0.42,
                    "sine",
                    0.075,
                    130
                );

            }

        }, 350);

    },


    /* =====================================================
       BACKGROUND MUSIC ELEMENT
    ===================================================== */

    createMusic() {

        if (this.musicAudio) {
            return;
        }


        this.musicAudio =
            document.createElement(
                "audio"
            );


        this.musicAudio.id =
            "blockblast-background-music";


        this.musicAudio.loop =
            true;


        this.musicAudio.preload =
            "auto";


        this.musicAudio.volume =
            this.musicVolume;


        this.musicAudio.style.display =
            "none";


        document.body.appendChild(
            this.musicAudio
        );


        try {

            const savedSong =
                localStorage.getItem(
                    "blockblast_custom_music"
                );


            if (savedSong) {

                this.musicAudio.src =
                    savedSong;

                this.customMusicURL =
                    savedSong;

            }

        } catch (error) {}

    },


    /* =====================================================
       START MUSIC
    ===================================================== */

    startMusic() {

        if (!this.musicEnabled) {
            return;
        }


        this.createMusic();


        if (!this.musicAudio) {
            return;
        }


        if (!this.musicAudio.src) {

            /*
               No custom song selected.
               We create a soft built-in
               ambient loop using Web Audio.
            */

            this.startAmbientMusic();

            return;

        }


        this.musicAudio.volume =
            this.musicVolume;


        const promise =
            this.musicAudio.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(() => {});

        }

    },


    /* =====================================================
       STOP MUSIC
    ===================================================== */

    stopMusic() {

        if (
            this.musicAudio
        ) {

            this.musicAudio.pause();

        }


        this.stopAmbientMusic();

    },


    /* =====================================================
       MUSIC ENABLE
    ===================================================== */

    setMusicEnabled(enabled) {

        this.musicEnabled =
            Boolean(enabled);


        if (
            this.musicEnabled
        ) {

            this.startMusic();

        } else {

            this.stopMusic();

        }

    },


    /* =====================================================
       MUSIC VOLUME
    ===================================================== */

    setMusicVolume(volume) {

        this.musicVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        if (this.musicAudio) {

            this.musicAudio.volume =
                this.musicVolume;

        }

    },


    /* =====================================================
       CUSTOM MUSIC
    ===================================================== */

    chooseMusic() {

        this.createMusic();


        const input =
            document.createElement(
                "input"
            );


        input.type =
            "file";


        input.accept =
            "audio/*";


        input.style.display =
            "none";


        document.body.appendChild(
            input
        );


        input.addEventListener(
            "change",
            () => {

                const file =
                    input.files &&
                    input.files[0];


                if (!file) {
                    return;
                }


                const url =
                    URL.createObjectURL(
                        file
                    );


                this.customMusicURL =
                    url;


                if (
                    this.musicAudio
                ) {

                    this.musicAudio.src =
                        url;

                    this.musicAudio.currentTime =
                        0;

                    this.musicAudio.volume =
                        this.musicVolume;

                }


                /*
                   Keep selected song for
                   this browser session.
                */

                try {

                    /*
                       Don't store giant audio
                       files in localStorage.
                       The current session keeps
                       the selected object URL.
                    */

                    localStorage.setItem(
                        "blockblast_music_name",
                        file.name
                    );

                } catch (error) {}


                if (
                    this.musicEnabled
                ) {

                    this.startMusic();

                }


                input.remove();

            }
        );


        input.click();

    },


    /* =====================================================
       SOFT BUILT-IN AMBIENT MUSIC
    ===================================================== */

    ambientTimer: null,

    ambientNodes: [],


    startAmbientMusic() {

        if (!this.musicEnabled) {
            return;
        }


        this.resume();


        if (
            !this.context
        ) {
            return;
        }


        this.stopAmbientMusic();


        const notes = [
            261.63,
            329.63,
            392.00,
            493.88
        ];


        let index = 0;


        const playNote = () => {

            if (
                !this.musicEnabled
            ) {
                return;
            }


            const frequency =
                notes[index % notes.length];


            index++;


            const oscillator =
                this.context.createOscillator();


            const gain =
                this.context.createGain();


            const now =
                this.context.currentTime;


            oscillator.type =
                "sine";


            oscillator.frequency.value =
                frequency;


            gain.gain.setValueAtTime(
                0.0001,
                now
            );


            gain.gain.linearRampToValueAtTime(
                this.musicVolume * 0.12,
                now + 0.5
            );


            gain.gain.linearRampToValueAtTime(
                0.0001,
                now + 2.5
            );


            oscillator.connect(
                gain
            );


            gain.connect(
                this.context.destination
            );


            oscillator.start(
                now
            );


            oscillator.stop(
                now + 2.6
            );


        };


        playNote();


        this.ambientTimer =
            setInterval(
                playNote,
                2400
            );

    },


    /* =====================================================
       STOP AMBIENT
    ===================================================== */

    stopAmbientMusic() {

        if (
            this.ambientTimer
        ) {

            clearInterval(
                this.ambientTimer
            );


            this.ambientTimer =
                null;

        }

    },


    /* =====================================================
       MUSIC PICKER BUTTON
    ===================================================== */

    createMusicPickerButton() {

        if (
            document.getElementById(
                "blockblast-custom-music"
            )
        ) {
            return;
        }


        const button =
            document.createElement(
                "button"
            );


        button.id =
            "blockblast-custom-music";


        button.type =
            "button";


        button.innerHTML =
            "🎵 Choose Your Music";


        button.style.cssText = `
            width:100%;
            margin-top:12px;
            padding:13px 16px;
            border:1px solid rgba(255,255,255,.12);
            border-radius:14px;
            background:rgba(255,255,255,.06);
            color:white;
            font-size:14px;
            font-weight:800;
            cursor:pointer;
        `;


        button.addEventListener(
            "click",
            () => {

                this.click();

                this.chooseMusic();

            }
        );


        const panel =
            document.getElementById(
                "settings-panel"
            );


        if (panel) {

            const content =
                panel.querySelector(
                    ".settings-content"
                );


            if (content) {

                content.appendChild(
                    button
                );

            } else {

                panel.appendChild(
                    button
                );

            }

        }

    }

};


/* =========================================================
   INIT MUSIC
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        BlockBlastSound.createMusic();

        BlockBlastSound.createMusicPickerButton();


        if (
            typeof blockBlastSettings !==
            "undefined"
        ) {

            BlockBlastSound.enabled =
                Boolean(
                    blockBlastSettings.sfx
                );


            BlockBlastSound.musicEnabled =
                Boolean(
                    blockBlastSettings.music
                );


            BlockBlastSound.musicVolume =
                Number(
                    blockBlastSettings.musicVolume
                );

        }

    }
);


/* =========================================================
   GLOBAL
========================================================= */

window.BlockBlastSound =
    BlockBlastSound;