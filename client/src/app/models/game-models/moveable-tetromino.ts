/*
A tetromino set to some absolute position and rotation on the board. Mutable, so can be translated around.
Exposes utility methods for checking if the tetromino is in bounds, and if it is colliding with
other blocks.
*/

import BinaryGrid, { BlockType } from "../tetronimo-models/binary-grid";
import { BlockSet } from "../tetronimo-models/block";
import { ALL_TETROMINO_TYPES, Tetromino, TetrominoType } from "../tetronimo-models/tetromino";
import { GameDebugService } from "../../services/game-debug.service";


export default class MoveableTetromino {

    private currentBlockSet!: BlockSet;

    constructor(public readonly tetrominoType: TetrominoType, private rotation: number, private translateX: number, private translateY: number) {
        this.updateCurrentBlockSet()
    }

    static doesBlocksetMatchMask(pieceMask: BinaryGrid, maskStartX: number, maskStartY: number, blockSet: BlockSet): boolean {
        let exists = true;
        blockSet.blocks.forEach(block => {
            if (!pieceMask.exists(block.x + maskStartX, block.y + maskStartY)) {
                exists = false;
            }
        });
        return exists;
    }

    static getMTForPieceMask(pieceMask: BinaryGrid, maskStartX: number, maskStartY: number, pieceType: TetrominoType): MoveableTetromino | undefined {
        const tetronimo = Tetromino.getPieceByType(pieceType);
        console.log("getmtf", pieceType);
        console.log(tetronimo.numPossibleRotations());
        for (let rot = 0; rot < tetronimo.numPossibleRotations(); rot++) {
            const blockSet = tetronimo.getBlockSet(rot);
            if (MoveableTetromino.doesBlocksetMatchMask(pieceMask, maskStartX, maskStartY, blockSet)) {
                return new MoveableTetromino(pieceType, rot, maskStartX, maskStartY);
            }
        }
        return undefined;
    };

    // given grids without and with the piece, return a MoveableTetromino that represents the piece if found,
    // or undefined if not found
    // pieceType is unknown for first piece, but is known through previous placement's nextbox for subsequent pieces
    static computeMoveableTetronimo(debug: GameDebugService, pieceMask?: BinaryGrid, pieceType?: TetrominoType): MoveableTetromino | undefined {

        if (pieceMask === undefined) {
            debug.log("pieceMask undefined");
            return undefined;
        }

        if (pieceMask.count() !== 4) {
            debug.log("pieceMask count not 4");
            return undefined;
        }

        // find the location of the most top-left mino on the pieceMask
        let minX = 10;
        let minY = 20;
        pieceMask.blocks.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block === BlockType.FILLED) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                }
            });
        });


        let piecesToTry: TetrominoType[];
        if (pieceType) piecesToTry = [pieceType];
        else piecesToTry = ALL_TETROMINO_TYPES;

        for (let pieceType of piecesToTry) {
            const mt = MoveableTetromino.getMTForPieceMask(pieceMask, minX, minY, pieceType);
            if (mt) {
                debug.log(`found matching MoveableTetronimo ${mt.tetrominoType} at ${mt.translateX}, ${mt.translateY}`);
                return mt;
            }
        }

        debug.log("no matching MoveableTetronimo found");
        return undefined;
    }

    private updateCurrentBlockSet(): void {
        const tetromino = Tetromino.getPieceByType(this.tetrominoType);
        this.currentBlockSet = tetromino.getBlockSet(this.rotation).translate(this.translateX, this.translateY);
    }

    public getCurrentBlockSet(): BlockSet {
        return this.currentBlockSet;
    }

    public getRotation(): number {
        return this.rotation;
    }

    public getTranslateX(): number {
        return this.translateX;
    }

    public getTranslateY(): number {
        return this.translateY;
    }

    public updatePose(rotation: number | undefined, translateX: number | undefined, translateY: number | undefined): void {
        if (rotation !== undefined) {
            const numPossibleRotations = Tetromino.getPieceByType(this.tetrominoType).numPossibleRotations();
            this.rotation = rotation % numPossibleRotations;
        }
        if (translateX !== undefined) {
            this.translateX = translateX;
        }
        if (translateY !== undefined) {
            this.translateY = translateY;
        }
        this.updateCurrentBlockSet();
    }

    // if the tetromino is out of bounds, move it back in bounds
    public moveToBounds(): void {
        let moveX = 0;
        let moveY = 0;
        this.currentBlockSet.blocks.forEach(block => {
            if (block.x < 0) moveX = Math.max(moveX, -block.x);
            if (block.x > 9) moveX = Math.min(moveX, 9 - block.x);
            if (block.y < 0) moveY = Math.max(moveY, -block.y);
            if (block.y > 19) moveY = Math.min(moveY, 19 - block.y);
        });
        this.translateX += moveX;
        this.translateY += moveY;
        this.updateCurrentBlockSet();
    }

    public isInBounds(): boolean {
        return this.getCurrentBlockSet().blocks.every(block => block.x >= 0 && block.x <= 9 && block.y >= 0 && block.y <= 19);
    }


    // Whether one of the minos of this tetromino is a the given position
    public isAtLocation(x: number, y: number): boolean {
        return this.getCurrentBlockSet().blocks.some(block => block.x === x && block.y === y);
    }

    // modify the given grid to include the blocks of this tetromino
    public blitToGrid(grid: BinaryGrid): BinaryGrid {

        const blockSet = this.getCurrentBlockSet();
        blockSet.blocks.forEach(block => {
            grid.setAt(block.x, block.y, BlockType.FILLED);
        });
        return grid;
    }

    public intersectsGrid(grid: BinaryGrid): boolean {
        return this.getCurrentBlockSet().blocks.some(block => grid.at(block.x, block.y) === BlockType.FILLED);
    }

    // placement is valid if the piece is in bounds, and does not intersect with the grid, 
    // but moving the piece down one row would intersect with the grid
    public isValidPlacement(grid: BinaryGrid): boolean {
        if (!this.isInBounds()) return false;
        if (this.intersectsGrid(grid)) return false;
        const movedMT = new MoveableTetromino(this.tetrominoType, this.rotation, this.translateX, this.translateY + 1);
        return !movedMT.isInBounds() || movedMT.intersectsGrid(grid);
    }

    public equals(other: MoveableTetromino): boolean {
        if (this.tetrominoType !== other.tetrominoType) return false;
        if (this.rotation !== other.rotation) return false;
        if (this.translateX !== other.translateX) return false;
        if (this.translateY !== other.translateY) return false;
        return true;
    }

    // return in tetris notation
    public toString(): string {

        let string = "" + this.tetrominoType + "-";

        // find all the columns that have blocks
        const columns: number[] = [];
        this.getCurrentBlockSet().blocks.forEach(block => {
            if (!columns.includes(block.x)) {
                columns.push(block.x);
            }
        });

        // sort columns in ascending order
        columns.sort((a, b) => a - b);

        // assemble into string
        columns.forEach(column => {
            if (column === 9) string += "0";
            else string += column + 1;
        });

        return string;
    }

    public print() {
        const mask = this.blitToGrid(new BinaryGrid());
        console.log(this.toString());
        mask.print();
    }
}
