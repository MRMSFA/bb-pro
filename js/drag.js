(() => {

    "use strict";


    /* ==========================================
       DRAG STATE
    ========================================== */

    let activeBlock = null;

    let activeShape = null;

    let activeColor = null;

    let dragging = false;

    let activePointerId = null;

    let grabOffsetX = 0;

    let grabOffsetY = 0;

    let originalParent = null;

    let originalNextSibling = null;

    let previewRow = null;

    let previewCol = null;

    let previewValid = false;

    let previewCells = [];



    /* ==========================================
       CONFIG
    ========================================== */

    const DRAG_SCALE =
        1.08;

    const DRAG_Z_INDEX =
        9999;

    const BLOCK_SELECTOR =
        ".game-block";

    const CELL_SELECTOR =
        ".cell";



    /* ==========================================
       SOUND
    ========================================== */

    function playSound(name){

        if(
            window.BlockBlastSound &&
            typeof window.BlockBlastSound[name] ===
            "function"
        ){

            window.BlockBlastSound[name]();

        }

    }



    /* ==========================================
       VIBRATION
    ========================================== */

    function vibrate(pattern){

        if(
            typeof window.BlockBlastVibrate ===
            "function"
        ){

            window.BlockBlastVibrate(
                pattern
            );

        }

    }



    /* ==========================================
       ENABLE DRAGGING
    ========================================== */

    function enableDragging(){

        const blocks =
            document.querySelectorAll(
                BLOCK_SELECTOR
            );


        blocks.forEach(
            block => {

                block.draggable =
                    false;


                block.removeEventListener(
                    "pointerdown",
                    startDrag
                );


                block.addEventListener(
                    "pointerdown",
                    startDrag,
                    {
                        passive: false
                    }
                );

            }
        );


        /*
            Don't immediately trigger
            game over while a drag is active.
        */

        if(!dragging){

            setTimeout(
                () => {

                    checkGameOver();

                },
                50
            );

        }

    }



    /* ==========================================
       START DRAG
    ========================================== */

    function startDrag(event){

        if(
            event.button !== undefined &&
            event.button !== 0
        ){

            return;

        }


        if(dragging){

            return;

        }


        /*
            Prevent interaction after
            game over.
        */

        const gameOver =
            document.getElementById(
                "game-over"
            );


        if(
            gameOver &&
            gameOver.style.display ===
            "flex"
        ){

            return;

        }


        event.preventDefault();


        const block =
            event.currentTarget;


        if(!block){

            return;

        }



        /* ==========================================
           SAVE ORIGINAL LOCATION
        ========================================== */

        activeBlock =
            block;


        originalParent =
            block.parentNode;


        originalNextSibling =
            block.nextSibling;



        /* ==========================================
           READ SHAPE
        ========================================== */

        try{

            activeShape =
                JSON.parse(
                    block.dataset.shape
                );

        }catch(error){

            console.error(
                "Invalid block shape:",
                error
            );


            resetDragState();

            return;

        }


        activeColor =
            block.dataset.color ||
            "#3B82F6";



        /* ==========================================
           POINTER
        ========================================== */

        activePointerId =
            event.pointerId;


        dragging =
            true;



        /* ==========================================
           PICKUP SOUND
        ========================================== */

        playSound(
            "pickup"
        );


        vibrate(8);



        /* ==========================================
           ORIGINAL RECT
        ========================================== */

        const rect =
            block.getBoundingClientRect();


        grabOffsetX =
            event.clientX -
            rect.left;


        grabOffsetY =
            event.clientY -
            rect.top;



        /* ==========================================
           MOVE TO BODY
        ========================================== */

        document.body.appendChild(
            block
        );


        block.style.position =
            "fixed";


        block.style.left =
            `${rect.left}px`;


        block.style.top =
            `${rect.top}px`;


        block.style.width =
            `${rect.width}px`;


        block.style.height =
            `${rect.height}px`;


        block.style.zIndex =
            DRAG_Z_INDEX;


        block.style.pointerEvents =
            "none";


        block.style.cursor =
            "grabbing";


        block.style.transition =
            "none";


        block.style.transform =
            `scale(${DRAG_SCALE})`;


        block.classList.add(
            "dragging"
        );



        /* ==========================================
           POINTER CAPTURE
        ========================================== */

        try{

            block.setPointerCapture(
                event.pointerId
            );

        }catch(error){

            /* Safe */

        }



        /* ==========================================
           GLOBAL EVENTS
        ========================================== */

        document.addEventListener(
            "pointermove",
            dragMove,
            {
                passive: false
            }
        );


        document.addEventListener(
            "pointerup",
            stopDrag,
            {
                passive: false
            }
        );


        document.addEventListener(
            "pointercancel",
            cancelDrag,
            {
                passive: false
            }
        );



        /* ==========================================
           INITIAL POSITION
        ========================================== */

        moveBlock(
            event.clientX,
            event.clientY
        );

    }



    /* ==========================================
       DRAG MOVE
    ========================================== */

    function dragMove(event){

        if(!dragging){

            return;

        }


        if(
            event.pointerId !==
            activePointerId
        ){

            return;

        }


        event.preventDefault();


        moveBlock(
            event.clientX,
            event.clientY
        );

    }



    /* ==========================================
       MOVE BLOCK
    ========================================== */

    function moveBlock(
        pointerX,
        pointerY
    ){

        if(!activeBlock){

            return;

        }


        const left =
            pointerX -
            grabOffsetX;


        const top =
            pointerY -
            grabOffsetY;


        activeBlock.style.left =
            `${left}px`;


        activeBlock.style.top =
            `${top}px`;


        updatePreview(
            pointerX,
            pointerY
        );

    }



    /* ==========================================
       CLOSEST CELL
    ========================================== */

    function getClosestCell(
        x,
        y
    ){

        const cells =
            Array.from(
                document.querySelectorAll(
                    CELL_SELECTOR
                )
            );


        let closest =
            null;


        let closestDistance =
            Infinity;


        cells.forEach(
            cell => {

                const rect =
                    cell.getBoundingClientRect();


                const centerX =
                    rect.left +
                    rect.width / 2;


                const centerY =
                    rect.top +
                    rect.height / 2;


                const dx =
                    x -
                    centerX;


                const dy =
                    y -
                    centerY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                const maxDistance =
                    Math.max(
                        rect.width,
                        rect.height
                    ) * 1.35;


                if(
                    distance <=
                    maxDistance &&
                    distance <
                    closestDistance
                ){

                    closest =
                        cell;


                    closestDistance =
                        distance;

                }

            }
        );


        return closest;

    }



    /* ==========================================
       UPDATE PREVIEW
    ========================================== */

    function updatePreview(
        pointerX,
        pointerY
    ){

        clearPreview();


        if(!activeShape){

            return;

        }


        const target =
            getClosestCell(
                pointerX,
                pointerY
            );


        if(!target){

            previewRow =
                null;


            previewCol =
                null;


            previewValid =
                false;


            return;

        }


        const targetRow =
            Number(
                target.dataset.row
            );


        const targetCol =
            Number(
                target.dataset.col
            );


        const shapeHeight =
            activeShape.length;


        const shapeWidth =
            activeShape[0].length;



        /* ==========================================
           CENTER SHAPE
        ========================================== */

        let startRow =
            targetRow -
            Math.floor(
                shapeHeight / 2
            );


        let startCol =
            targetCol -
            Math.floor(
                shapeWidth / 2
            );



        /* ==========================================
           CLAMP
        ========================================== */

        if(startRow < 0){

            startRow =
                0;

        }


        if(startCol < 0){

            startCol =
                0;

        }


        if(
            startRow +
            shapeHeight >
            BOARD_SIZE
        ){

            startRow =
                BOARD_SIZE -
                shapeHeight;

        }


        if(
            startCol +
            shapeWidth >
            BOARD_SIZE
        ){

            startCol =
                BOARD_SIZE -
                shapeWidth;

        }



        /* ==========================================
           TOO LARGE
        ========================================== */

        if(
            startRow < 0 ||
            startCol < 0
        ){

            previewRow =
                null;


            previewCol =
                null;


            previewValid =
                false;


            showPreview(
                startRow,
                startCol,
                false
            );


            return;

        }



        /* ==========================================
           SAVE PREVIEW
        ========================================== */

        previewRow =
            startRow;


        previewCol =
            startCol;


        previewValid =
            canPlaceShape(
                startRow,
                startCol
            );


        showPreview(
            startRow,
            startCol,
            previewValid
        );

    }



    /* ==========================================
       SHOW PREVIEW
    ========================================== */

    function showPreview(
        startRow,
        startCol,
        valid
    ){

        if(!activeShape){

            return;

        }


        for(
            let r = 0;
            r < activeShape.length;
            r++
        ){

            for(
                let c = 0;
                c < activeShape[r].length;
                c++
            ){

                if(
                    activeShape[r][c] !==
                    1
                ){

                    continue;

                }


                const row =
                    startRow +
                    r;


                const col =
                    startCol +
                    c;


                if(
                    row < 0 ||
                    row >= BOARD_SIZE ||
                    col < 0 ||
                    col >= BOARD_SIZE
                ){

                    continue;

                }


                const cell =
                    document.querySelector(
                        `.cell[data-row="${row}"][data-col="${col}"]`
                    );


                if(!cell){

                    continue;

                }


                if(valid){

                    cell.classList.add(
                        "preview"
                    );

                }else{

                    cell.classList.add(
                        "invalid"
                    );

                }


                previewCells.push(
                    cell
                );

            }

        }

    }



    /* ==========================================
       CLEAR PREVIEW
    ========================================== */

    function clearPreview(){

        previewCells.forEach(
            cell => {

                cell.classList.remove(
                    "preview"
                );


                cell.classList.remove(
                    "invalid"
                );

            }
        );


        previewCells =
            [];

    }



    /* ==========================================
       CAN PLACE SHAPE
    ========================================== */

    function canPlaceShape(
        startRow,
        startCol
    ){

        if(!activeShape){

            return false;

        }


        for(
            let r = 0;
            r < activeShape.length;
            r++
        ){

            for(
                let c = 0;
                c < activeShape[r].length;
                c++
            ){

                if(
                    activeShape[r][c] !==
                    1
                ){

                    continue;

                }


                const row =
                    startRow +
                    r;


                const col =
                    startCol +
                    c;


                if(
                    row < 0 ||
                    row >= BOARD_SIZE ||
                    col < 0 ||
                    col >= BOARD_SIZE
                ){

                    return false;

                }


                if(
                    board[row][col] ===
                    1
                ){

                    return false;

                }

            }

        }


        return true;

    }



    /* ==========================================
       CHECK SHAPE ANYWHERE
    ========================================== */

    function shapeHasValidMove(
        shape
    ){

        if(!shape){

            return false;

        }


        const height =
            shape.length;


        const width =
            shape[0].length;


        if(
            height > BOARD_SIZE ||
            width > BOARD_SIZE
        ){

            return false;

        }


        for(
            let row = 0;
            row <=
            BOARD_SIZE - height;
            row++
        ){

            for(
                let col = 0;
                col <=
                BOARD_SIZE - width;
                col++
            ){

                let valid =
                    true;


                for(
                    let r = 0;
                    r < height;
                    r++
                ){

                    for(
                        let c = 0;
                        c < width;
                        c++
                    ){

                        if(
                            shape[r][c] !==
                            1
                        ){

                            continue;

                        }


                        if(
                            board[
                                row + r
                            ][
                                col + c
                            ] === 1
                        ){

                            valid =
                                false;

                            break;

                        }

                    }


                    if(!valid){

                        break;

                    }

                }


                if(valid){

                    return true;

                }

            }

        }


        return false;

    }



    /* ==========================================
       CHECK GAME OVER
    ========================================== */

    function checkGameOver(){

        if(dragging){

            return false;

        }


        const overlay =
            document.getElementById(
                "game-over"
            );


        /*
            Don't trigger twice.
        */

        if(
            overlay &&
            overlay.style.display ===
            "flex"
        ){

            return true;

        }


        const blocks =
            Array.from(
                document.querySelectorAll(
                    BLOCK_SELECTOR
                )
            );


        /*
            No blocks means a new set
            will be generated.
        */

        if(
            blocks.length ===
            0
        ){

            return false;

        }


        /*
            Test every remaining block.
        */

        for(
            const block of blocks
        ){

            let shape =
                null;


            try{

                shape =
                    JSON.parse(
                        block.dataset.shape
                    );

            }catch(error){

                continue;

            }


            /*
                If ANY block can fit,
                player can continue.
            */

            if(
                shapeHasValidMove(
                    shape
                )
            ){

                return false;

            }

        }


        /*
            Nothing can fit.
            GAME OVER.
        */

        triggerGameOver();


        return true;

    }



    /* ==========================================
       TRIGGER GAME OVER
    ========================================== */

    function triggerGameOver(){

        if(
            typeof window.showGameOver !==
            "function"
        ){

            return;

        }


        window.showGameOver();

    }



    /* ==========================================
       STOP DRAG
    ========================================== */

    function stopDrag(event){

        if(!dragging){

            return;

        }


        if(
            event.pointerId !==
            activePointerId
        ){

            return;

        }


        event.preventDefault();


        const valid =
            previewValid &&
            previewRow !== null &&
            previewCol !== null;


        /* ==========================================
           VALID
        ========================================== */

        if(valid){

            const placed =
                placeShape(
                    previewRow,
                    previewCol
                );


            if(!placed){

                playSound(
                    "invalid"
                );


                returnBlock();

            }

        }


        /* ==========================================
           INVALID
        ========================================== */

        else{

            playSound(
                "invalid"
            );


            returnBlock();

        }


        cleanup();

    }



    /* ==========================================
       PLACE SHAPE
    ========================================== */

    function placeShape(
        startRow,
        startCol
    ){

        if(
            !canPlaceShape(
                startRow,
                startCol
            )
        ){

            return false;

        }



        /* ==========================================
           WRITE TO BOARD
        ========================================== */

        for(
            let r = 0;
            r < activeShape.length;
            r++
        ){

            for(
                let c = 0;
                c < activeShape[r].length;
                c++
            ){

                if(
                    activeShape[r][c] !==
                    1
                ){

                    continue;

                }


                board[
                    startRow + r
                ][
                    startCol + c
                ] = 1;

            }

        }



        /* ==========================================
           UPDATE BOARD
        ========================================== */

        updateBoard();



        /* ==========================================
           PLACE SOUND
        ========================================== */

        playSound(
            "place"
        );


        vibrate(12);



        /* ==========================================
           SCORE
        ========================================== */

        if(
            typeof addScore ===
            "function"
        ){

            addScore(10);

        }



        /* ==========================================
           GAME UPDATE
        ========================================== */

        if(
            typeof updateGame ===
            "function"
        ){

            updateGame();

        }



        /* ==========================================
           SAVE PLACED BLOCK
        ========================================== */

        const placedBlock =
            activeBlock;


        placedBlock.style.transition =
            "transform .12s ease, opacity .12s ease";


        placedBlock.style.transform =
            "scale(.65)";


        placedBlock.style.opacity =
            "0";



        /* ==========================================
           REMOVE BLOCK
        ========================================== */

        setTimeout(
            () => {


                if(
                    placedBlock &&
                    placedBlock.parentNode
                ){

                    placedBlock.remove();

                }


                const remaining =
                    document.querySelectorAll(
                        BLOCK_SELECTOR
                    );


                /* ==========================================
                   NEW SET
                ========================================== */

                if(
                    remaining.length ===
                    0
                ){

                    generateBlocks();

                    enableDragging();

                    playSound(
                        "newBlocks"
                    );


                    return;

                }


                /*
                    IMPORTANT:
                    Check the CURRENT remaining
                    blocks after placement.
                */

                setTimeout(
                    () => {

                        checkGameOver();

                    },
                    30
                );


            },
            120
        );


        return true;

    }



    /* ==========================================
       RETURN BLOCK
    ========================================== */

    function returnBlock(){

        if(!activeBlock){

            return;

        }


        if(
            originalParent &&
            originalParent.isConnected
        ){

            if(
                originalNextSibling &&
                originalNextSibling.parentNode ===
                originalParent
            ){

                originalParent.insertBefore(
                    activeBlock,
                    originalNextSibling
                );

            }else{

                originalParent.appendChild(
                    activeBlock
                );

            }

        }



        /* ==========================================
           RESET STYLES
        ========================================== */

        activeBlock.style.position =
            "";


        activeBlock.style.left =
            "";


        activeBlock.style.top =
            "";


        activeBlock.style.width =
            "";


        activeBlock.style.height =
            "";


        activeBlock.style.zIndex =
            "";


        activeBlock.style.pointerEvents =
            "";


        activeBlock.style.cursor =
            "";


        activeBlock.style.transition =
            "transform .18s ease";


        activeBlock.style.transform =
            "scale(.92)";


        activeBlock.classList.remove(
            "dragging"
        );


        const block =
            activeBlock;


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        if(block){

                            block.style.transform =
                                "";

                        }

                    }
                );

            }
        );

    }



    /* ==========================================
       CANCEL DRAG
    ========================================== */

    function cancelDrag(event){

        if(!dragging){

            return;

        }


        if(
            event.pointerId !==
            activePointerId
        ){

            return;

        }


        playSound(
            "invalid"
        );


        returnBlock();


        cleanup();

    }



    /* ==========================================
       CLEANUP
    ========================================== */

    function cleanup(){

        clearPreview();


        document.removeEventListener(
            "pointermove",
            dragMove
        );


        document.removeEventListener(
            "pointerup",
            stopDrag
        );


        document.removeEventListener(
            "pointercancel",
            cancelDrag
        );


        dragging =
            false;


        activeBlock =
            null;


        activeShape =
            null;


        activeColor =
            null;


        activePointerId =
            null;


        originalParent =
            null;


        originalNextSibling =
            null;


        grabOffsetX =
            0;


        grabOffsetY =
            0;


        previewRow =
            null;


        previewCol =
            null;


        previewValid =
            false;

    }



    /* ==========================================
       RESET DRAG STATE
    ========================================== */

    function resetDragState(){

        activeBlock =
            null;


        activeShape =
            null;


        activeColor =
            null;


        dragging =
            false;


        activePointerId =
            null;

    }



    /* ==========================================
       PUBLIC API
    ========================================== */

    window.enableDragging =
        enableDragging;


    window.checkGameOver =
        checkGameOver;


    window.BlockBlastDrag = {

        enable:
            enableDragging,

        clearPreview:
            clearPreview,

        isDragging:
            () => dragging,

        checkGameOver:
            checkGameOver

    };



    /* ==========================================
       INITIALIZE
    ========================================== */

    if(
        document.readyState ===
        "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            enableDragging,
            {
                once: true
            }
        );

    }else{

        enableDragging();

    }

})();