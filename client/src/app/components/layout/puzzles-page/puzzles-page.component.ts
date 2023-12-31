import { Component } from '@angular/core';
import { EvaluationRating } from 'client/src/app/misc/colors';
import MoveableTetromino from 'client/src/app/models/game-models/moveable-tetromino';
import { Puzzle, PuzzleDifficulty } from 'client/src/app/models/puzzle';
import TagAssigner, { SimplePlacement } from 'client/src/app/models/tag-models/tag-assigner';
import BinaryGrid, { BlockType } from 'client/src/app/models/tetronimo-models/binary-grid';
import ColorGrid from 'client/src/app/models/tetronimo-models/color-grid';
import { Tetromino, TetrominoType } from 'client/src/app/models/tetronimo-models/tetromino';
import { findConnectedComponent } from 'client/src/app/scripts/connected-components';
import { decodeColorGrid, encodeColorGrid } from 'client/src/app/scripts/encode-color-grid';
import { compressGridStringToBase64, decompressBase64ToGridString } from 'shared/scripts/compress-grid';

@Component({
  selector: 'app-puzzles-page',
  templateUrl: './puzzles-page.component.html',
  styleUrls: ['./puzzles-page.component.scss']
})
export class PuzzlesPageComponent {

  public puzzle: Puzzle;

  constructor() {
    
    this.puzzle = new Puzzle(
      new BinaryGrid(),
      new MoveableTetromino(TetrominoType.L_TYPE, 0, 0, 0),
      new MoveableTetromino(TetrominoType.J_TYPE, 0, 0, 0),
      PuzzleDifficulty.A_TIER,
    );

    const binaryGrid = new BinaryGrid();
    // randomize 
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 20; y++) {
        binaryGrid.setAt(x, y, Math.random() > 0.5 ? BlockType.FILLED : BlockType.EMPTY);
      }
    }

    const colorGrid = new ColorGrid();

    binaryGrid.print();

    const encoded = encodeColorGrid(binaryGrid, colorGrid);
    console.log(encoded);

    const decoded = decodeColorGrid(encoded);
    console.log("decoded:", decoded.binaryGrid);
    

  }

}
