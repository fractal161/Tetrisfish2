import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RateMoveDeep } from 'client/src/app/models/analysis-models/rate-move';
import { Game } from 'client/src/app/models/game-models/game';
import { GamePlacement } from 'client/src/app/models/game-models/game-placement';
import MoveableTetromino from 'client/src/app/models/game-models/moveable-tetromino';
import BinaryGrid from 'client/src/app/models/tetronimo-models/binary-grid';
import { TetrominoType } from 'client/src/app/models/tetronimo-models/tetromino';
import { InputSpeed } from 'client/src/app/scripts/evaluation/input-frame-timeline';
import { Method, fetchServer } from 'client/src/app/scripts/fetch-server';
import { GameCacheService } from 'client/src/app/services/game-cache.service';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { GameFromDatabase } from 'shared/models/game-from-database';

class GameInfo {
  playerName: string = "(unknown)";
  timestamp: Date = new Date();
  playstyle: string = "unknown";
}

@Component({
  selector: 'app-game-analysis-page',
  templateUrl: './game-analysis-page.component.html',
  styleUrls: ['./game-analysis-page.component.scss']
})
export class GameAnalysisPageComponent implements OnInit {

  public game?: Game;
  public gameInfo: GameInfo = new GameInfo();

  public placementIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifier: NotifierService,
    private gameCacheService: GameCacheService,
  ) {}

  // if there is a route parameters for a specific game, load it
  ngOnInit() {


    // Subscribe to paramMap to get the route parameters
    this.route.queryParams.subscribe(params => {
      // Get a specific parameter by name
      const gameID = params['id'];
      console.log("GameID:", gameID);

      // if game ID is not defined, redirect to analysis page
      if (!gameID) {
        this.notifier.hide("game-loading");
        this.notifier.notify("error", "Game not found");
        this.router.navigate(['/analysis']);
      } else if (this.gameCacheService.hasGame(gameID)) {

        // if game is cached, load it
        this.game = this.gameCacheService.getGame(gameID);
        console.log("Loaded cached game", gameID);
      
      } else {

        console.log("Game not cached, loading from server", gameID);
        // it might take a second to load the placements. note that analysis will be computed after initial load
        this.notifier.notify("info", "Loading game...", "game-loading");

        // Otherwise, load game
        fetchServer(Method.GET, "/api/get-game", {id : gameID}).then(({status, content}) => {
          if (status === 200) {
            this.loadGame(content as GameFromDatabase);
          } else {
            this.notifier.hide("game-loading");
            this.notifier.notify("error", "Game not found");
            this.router.navigate(['/analysis']);
          }
        });
      }
    });
  }

  // build a Game object from the database game data 
  loadGame(dbGame: GameFromDatabase) {

    console.log("Loading game", dbGame);

    // create game object to store placements. will be assigned to this.game after all placements are loaded
    const game = new Game(dbGame.startLevel, dbGame.inputSpeed as InputSpeed, dbGame.gameID);

    // add placements
    dbGame.placements.forEach(placement => {
      const grid = BinaryGrid.fromCompressedString(placement.b);
      game.addNewPosition(grid, placement.c as TetrominoType, placement.n as TetrominoType);
      const mt = new MoveableTetromino(placement.c as TetrominoType, placement.r, placement.x, placement.y);
      game.setPlacementForLastPosition(mt, placement.l);
    });

    // set game object
    this.game = game;

    // cache game
    this.gameCacheService.cacheGame(game);

    this.notifier.hide("game-loading");

  }

  getPosition(): GamePlacement {
    return this.game!.getPlacementAt(this.placementIndex);
  }

  getPlayerRating(): RateMoveDeep | undefined {
    return this.getPosition().analysis.getRateMoveDeep();
  }

  getRelativeTime(): string {
    const result = formatDistanceStrict(this.gameInfo.timestamp, new Date());
    return result + " ago";
  }

  hasPrevious(): boolean {
    return this.placementIndex > 0;
  }

  previous() {
    if (this.hasPrevious()) {
      this.placementIndex--;
    }
  }

  hasNext(): boolean {
    return this.placementIndex < this.game!.numPlacements - 1;
  }

  next() {
    if (this.hasNext()) {
      this.placementIndex++;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (event.key === "ArrowLeft" || event.key === ",") {
      this.previous();
    } else if (event.key === "ArrowRight" || event.key === ".") {
      this.next();
    }
  }

}
