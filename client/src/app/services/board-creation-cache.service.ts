import { Injectable } from '@angular/core';
import BoardState from '../components/tetris/interactive-tetris-board/board-state';
import BinaryGrid from '../models/mutable-tetris-models/binary-grid';
import { TetrominoType } from '../models/immutable-tetris-models/tetromino';

@Injectable({
  providedIn: 'root'
})
export class BoardCreationCacheService {

  public boardState = new BoardState(18, new BinaryGrid(), TetrominoType.J_TYPE, TetrominoType.T_TYPE);

}