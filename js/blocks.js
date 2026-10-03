/* ==========================================
   BLOCK BLAST PRO
   BLOCK SYSTEM
========================================== */

const blocksContainer = document.getElementById("blocks");

/* ==========================================
   COLORS
========================================== */

const COLORS = [
    "#00C2FF",
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6"
];

/* ==========================================
   SHAPES
========================================== */

const SHAPES = [

    [[1]],

    [[1,1]],

    [[1],[1]],

    [[1,1,1]],

    [[1],[1],[1]],

    [[1,1],[1,1]],

    [[1,0],
     [1,1]],

    [[0,1],
     [1,1]],

    [[1,1,1],
     [0,1,0]],

    [[1,1,1,1]],

    [[1],
     [1],
     [1],
     [1]]

];

/* ==========================================
   RANDOM SHAPE
========================================== */

function randomShape(){

    return SHAPES[
        Math.floor(
            Math.random() * SHAPES.length
        )
    ];

}

/* ==========================================
   RANDOM COLOR
========================================== */

function randomColor(){

    return COLORS[
        Math.floor(
            Math.random() * COLORS.length
        )
    ];

}

/* ==========================================
   CREATE BLOCK
========================================== */

function createBlock(shape){

    const block =
        document.createElement("div");

    block.className =
        "game-block";

    /*
     * Disable browser native dragging.
     * Professional pointer drag system
     * handles the block instead.
     */

    block.draggable = false;

    block.dataset.shape =
        JSON.stringify(shape);

    const color =
        randomColor();

    block.dataset.color =
        color;

    const rows =
        shape.length;

    const columns =
        shape[0].length;

    block.style.gridTemplateColumns =
        `repeat(${columns}, 28px)`;

    block.style.gridTemplateRows =
        `repeat(${rows}, 28px)`;

    /* ==========================================
       CREATE BLOCK CELLS
    ========================================== */

    shape.forEach(
        (row, rowIndex) => {

            row.forEach(
                (value, colIndex) => {

                    const cell =
                        document.createElement("div");

                    /*
                     * Save exact position.
                     * Drag engine uses these coordinates.
                     */

                    cell.dataset.row =
                        rowIndex;

                    cell.dataset.col =
                        colIndex;

                    if(value === 1){

                        cell.className =
                            "block-cell";

                        cell.style.background =
                            color;

                        cell.style.boxShadow =
                            `0 0 10px ${color}`;

                    }else{

                        cell.className =
                            "block-cell block-empty";

                    }

                    block.appendChild(cell);

                }
            );

        }
    );

    return block;
}

/* ==========================================
   GENERATE 3 BLOCKS
========================================== */

function generateBlocks(){

    blocksContainer.innerHTML = "";

    for(
        let i = 0;
        i < 3;
        i++
    ){

        const shape =
            randomShape();

        const block =
            createBlock(shape);

        blocksContainer.appendChild(
            block
        );

    }

}