import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ThresholdType } from 'client/src/app/models/capture-models/capture-settings';
import { ALL_INPUT_SPEEDS } from 'client/src/app/scripts/evaluation/input-frame-timeline';
import { CaptureFrameService, CaptureMode } from 'client/src/app/services/capture/capture-frame.service';
import { CaptureSettingsService } from 'client/src/app/services/capture/capture-settings.service';
import { ExtractedStateService } from 'client/src/app/services/capture/extracted-state.service';
import { VideoCaptureService } from 'client/src/app/services/capture/video-capture.service';

@Component({
  selector: 'app-calibrate-page',
  templateUrl: './calibrate-page.component.html',
  styleUrls: ['./calibrate-page.component.scss']
})
export class CalibratePageComponent implements AfterViewInit, OnDestroy {
  @Output() onSwitchMode = new EventEmitter<void>();
  
  public captureVideoElement!: ElementRef<HTMLVideoElement>;

  readonly ThresholdType = ThresholdType;
  readonly ALL_INPUT_SPEEDS = ALL_INPUT_SPEEDS;

  constructor(
    public videoCaptureService: VideoCaptureService,
    private captureSettingsService: CaptureSettingsService,
    private extractedStateService: ExtractedStateService,
    private captureFrameService: CaptureFrameService
    ) {}

  ngAfterViewInit(): void {
    this.captureVideoElement = this.videoCaptureService.getVideoElement();
    this.videoCaptureService.onEnterCalibratePage();
  }

  ngOnDestroy(): void {
    this.videoCaptureService.onLeaveCalibratePage();
  }

  public get settings() {
    return this.captureSettingsService.get();
  }

  public get extractedState() {
    return this.extractedStateService.get();
  }

  public isCalibrated(): boolean {
    return this.captureSettingsService.get().isCalibrated();
  }
}
