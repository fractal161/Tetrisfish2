import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ALL_PLAYSTYLES } from 'client/src/app/misc/playstyle';
import { ThresholdType } from 'client/src/app/models/capture-models/capture-settings';
import { ALL_INPUT_SPEEDS } from 'client/src/app/scripts/evaluation/input-frame-timeline';
import { CaptureFrameService, CaptureMode } from 'client/src/app/services/capture/capture-frame.service';
import { CaptureSettingsService } from 'client/src/app/services/capture/capture-settings.service';
import { ExtractedStateService } from 'client/src/app/services/capture/extracted-state.service';
import { VideoCaptureService } from 'client/src/app/services/capture/video-capture.service';
import { LoginStatus, UserService } from 'client/src/app/services/user.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-calibrate-page',
  templateUrl: './calibrate-page.component.html',
  styleUrls: ['./calibrate-page.component.scss']
})
export class CalibratePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() exitButtonText: string = "Back to Recording";
  @Output() onSwitchMode = new EventEmitter<void>();
  @Output() onExit = new EventEmitter<void>();
  
  public captureVideoElement!: ElementRef<HTMLVideoElement>;

  readonly ThresholdType = ThresholdType;
  readonly ALL_INPUT_SPEEDS = ALL_INPUT_SPEEDS;
  readonly ALL_PLAYSTYLES = ALL_PLAYSTYLES;

  public displayingInstructions: boolean = false;

  constructor(
    public videoCaptureService: VideoCaptureService,
    private captureSettingsService: CaptureSettingsService,
    private extractedStateService: ExtractedStateService,
    private userService: UserService,
    private router: Router,
    ) {}

    ngOnInit(): void {
      this.userService.loginStatus$.pipe(
        filter(status => status !== LoginStatus.LIMBO), // ignore unknown login status events
        take(1) // Take only the first value that passes the filter
      ).subscribe(status => {
  
        const loggedIn = status === LoginStatus.LOGGED_IN;
        if (!loggedIn) {
          this.router.navigate(['/play-portal']);
        }
      });
    }
  

  ngAfterViewInit(): void {
    this.captureVideoElement = this.videoCaptureService.getVideoElement();
    this.videoCaptureService.onEnterCalibratePage();
  }

  ngOnDestroy(): void {
    this.userService.postUserSettings();
    this.videoCaptureService.onLeaveCalibratePage();
  }

  showInstructions() {
    this.displayingInstructions = true;
  }

  hideInstructions() {
    this.displayingInstructions = false;
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
