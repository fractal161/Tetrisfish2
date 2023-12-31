import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FloodFill } from '../../scripts/floodfill';
import { Rectangle } from '../../models/capture-models/capture-settings';
import { CaptureSettingsService } from './capture-settings.service';
import { PixelReader } from '../../models/capture-models/pixel-reader';
import { BoardOCRBox } from '../../models/capture-models/ocr-box';

export enum CaptureMode {
  NORMAL = "NORMAL",
  CLICK_ON_BOARD = "CLICK_ON_BOARD", // click to set board bounding box through flood fill
}

@Injectable({
  providedIn: 'root'
})
export class CaptureFrameService implements PixelReader {

  public mode$ = new BehaviorSubject<CaptureMode>(CaptureMode.CLICK_ON_BOARD);

  private frame?: Uint8ClampedArray;
  private width?: number;
  private height?: number;

  constructor(private captureSettingsService: CaptureSettingsService) { }

  public hasFrame(): boolean {
    return this.frame !== undefined && this.width !== undefined && this.height !== undefined;
  }

  public setFrame(frame: Uint8ClampedArray, width: number, height: number): void {
    this.frame = frame;
    this.width = width;
    this.height = height;
  }

  public resetFrame(): void {
    this.frame = undefined;
    this.width = undefined;
    this.height = undefined;
  }

  // get RGB for pixel at (x, y), A is ignored
  public getPixelAt(x: number, y: number): [number, number, number] | undefined {
 
    if (!this.hasFrame()) {
      return undefined;
    }

    if (x < 0 || x >= this.width!) {
      return undefined;
    }

    if (y < 0 || y >= this.height!) {
      return undefined;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    const index = (y * this.width! + x) * 4;
    return [this.frame![index], this.frame![index + 1], this.frame![index + 2]];
  }

  // if each varies by less than 10, then they are similar
  public floodfillCondition(colorA: [number, number, number], colorB: [number, number, number]): boolean {
    return Math.abs(colorA[0] - colorB[0]) < 30 &&
      Math.abs(colorA[1] - colorB[1]) < 30 &&
      Math.abs(colorA[2] - colorB[2]) < 30;
  }

  // run floodfill at given canvas location to determine board bounding box
  public floodfillBoard(x: number, y: number): void {

    // get pixel color
    const color = this.getPixelAt(x, y);
    console.log("Clicked at", x, y, color);

    // run floodfill for main board to determine BoardOCRBox
    let floodfill = new FloodFill(this.width!, this.height!);
    floodfill.floodfill(this, x, y, this.floodfillCondition.bind(this));
    this.captureSettingsService.get().setBoardBoundingRect(floodfill.getRect()!);

    // run floodfill on each point for next box to determine NextBoxOCRBox
    const nextBoxPoints = this.captureSettingsService.get().getBoard()!.getNextBoxCanvasLocations();
    floodfill = new FloodFill(this.width!, this.height!);
    nextBoxPoints.forEach((point) => floodfill.floodfill(this, point.x, point.y, this.floodfillCondition.bind(this)));
    this.captureSettingsService.get().setNextBoundingRect(floodfill.getRect()!);

    // run floodfill on level point to determine LevelOCRBox
    const levelPoint = this.captureSettingsService.get().getBoard()!.getLevelCanvasLocation();
    floodfill = new FloodFill(this.width!, this.height!);
    floodfill.floodfill(this, levelPoint.x, levelPoint.y, this.floodfillCondition.bind(this));
    this.captureSettingsService.get().setLevelBoundingRect(floodfill.getRect()!);

    // run floodfill on lines point to determine LinesOCRBox
    const linesPoint = this.captureSettingsService.get().getBoard()!.getLinesCanvasLocation();
    floodfill = new FloodFill(this.width!, this.height!);
    floodfill.floodfill(this, linesPoint.x, linesPoint.y, this.floodfillCondition.bind(this));
    this.captureSettingsService.get().setLinesBoundingRect(floodfill.getRect()!);

    // finished processing mouse click, reset to normal capture mode
    this.resetCaptureMode();
  }

  public resetCaptureMode(): void {
    //this.mode$.next(CaptureMode.NORMAL);
  }

}
