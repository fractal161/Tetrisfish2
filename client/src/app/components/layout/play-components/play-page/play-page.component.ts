import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CaptureSettingsService } from 'client/src/app/services/capture/capture-settings.service';
import { CaptureFrameService, CaptureMode } from 'client/src/app/services/capture/capture-frame.service';
import { ExtractedState } from 'client/src/app/models/capture-models/extracted-state';
import { ExtractedStateService } from 'client/src/app/services/capture/extracted-state.service';
import { VideoCaptureService } from 'client/src/app/services/capture/video-capture.service';
import { GameStateMachineService, PlayStatus } from 'client/src/app/services/game-state-machine/game-state-machine.service';
import { TEXT_GREEN, TEXT_RED } from 'client/src/app/misc/colors';
import BinaryGrid from 'client/src/app/models/tetronimo-models/binary-grid';
import { GamePlacement } from 'client/src/app/models/game-models/game-placement';
import MoveableTetromino from 'client/src/app/models/game-models/moveable-tetromino';
import { MoveRecommendation } from 'client/src/app/models/analysis-models/engine-movelist-nb';
import { RateMoveDeep } from 'client/src/app/models/analysis-models/rate-move';

enum PanelMode {
  PLAY = "PLAY",
  CALIBRATE = "CALIBRATE"
}

export class LogMessage {
  constructor(
    public message: string,
    public good: boolean
  ) {}
}

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.scss']
})
export class PlayPageComponent implements AfterViewInit {
  @Input() videoElement!: ElementRef<HTMLVideoElement>;
  @Output() onSwitchMode = new EventEmitter<void>();
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  public panelMode: PanelMode = PanelMode.PLAY;
  public showBoundingBoxes: boolean = true;
  public showMinoIndicators: boolean = true;

  public logStatus: LogMessage = new LogMessage("Not recording", false);
  public logs: LogMessage[];

  constructor(
    public videoCaptureService: VideoCaptureService,
    public extractedStateService: ExtractedStateService,
    public captureSettingsService: CaptureSettingsService,
    private gameStateMachineService: GameStateMachineService,
    private captureFrameService: CaptureFrameService
    ) {
    this.logs = [
      new LogMessage("Messagasfdsfsda fsdfasdfasdfe 1", true),
      new LogMessage("Messaasdf sdffge 2", false),
      new LogMessage("Mesasdfasdfa sdfafdasfs dfaffdfasfdafssage 3", true),
      new LogMessage("Messagasfdsfsda fsdfasdfasdfe 1", true),
      new LogMessage("Messaasdf sdffge 2", false),
      new LogMessage("Mesasdfasdfa sdfafdasfs dfaffdfasfdafssage 3", true),
      new LogMessage("Messagasfdsfsda fsdfasdfasdfe 1", true),
      new LogMessage("Messaasdf sdffge 2", false),
      new LogMessage("Mesasdfasdfa sdfafdasfs dfaffdfasfdafssage 3", true),
    ];
  }

  ngAfterViewInit(): void {
      this.videoCaptureService.registerCanvas(this.canvasElement, true);
  }

  public get panelCalibrateMode(): boolean {
    return this.panelMode === PanelMode.CALIBRATE;
  }

  public get extractedState() {
    return this.extractedStateService.get();
  }

  public get settings() {
    return this.captureSettingsService.get();
  }

  public getScoreString(): string | number {
    const status = this.gameStateMachineService.getCurrentGameStatus();
    return status ? status.score : "N/A";
  }

  public getLevelString(): string | number {
    const status = this.gameStateMachineService.getCurrentGameStatus();
    return status ? status.level : "N/A";
  }

  public getLinesString(): string | number {
    const status = this.gameStateMachineService.getCurrentGameStatus();
    return status ? status.lines : "N/A";
  }

  public isInGame(): boolean {
    return this.gameStateMachineService.getGameStatus() === PlayStatus.PLAYING;
  }

  public goToCalibratePanel() {
    this.panelMode = PanelMode.CALIBRATE;
  }

  public exitCalibratePanel() {
    this.panelMode = PanelMode.PLAY;
  }

  public determineBoundingBoxes(event: Event) {
    console.log("determineBoundingBoxes");
    if (this.captureFrameService.hasFrame()) {
      event.stopPropagation();
      this.captureFrameService.mode$.next(CaptureMode.CLICK_ON_BOARD);
    }
  }

  public getThresholdString(): string {
    const threshold = this.settings.threshold;
    if (threshold < 10) return " " + threshold;
    else return "" + threshold;
  }

  public getStatusString(): string {
    if (this.isInGame()) {
      const startLevel = this.gameStateMachineService.getGameStartLevel();
      return `Playing Level ${startLevel} Start`;
    }
    else return "Not Playing";
  }

  public getStatusColor(): string {
    return this.isInGame() ? TEXT_GREEN : TEXT_RED;
  }

  public getLastPosition(): GamePlacement | undefined {
    return this.gameStateMachineService.getLastPosition();
  }

  public getBestMove(): MoveRecommendation | undefined {
    return this.gameStateMachineService.getGame()?.lastEngineMovelistNB$.getValue()?.analysis.getEngineMoveListNB()!.best;
  }

  public getMoveRating(): RateMoveDeep | undefined {
    return this.gameStateMachineService.getGame()?.lastRatingNB$.getValue()?.analysis.getRateMoveDeep();
  }

}
