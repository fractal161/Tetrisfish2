import { Injectable } from '@angular/core';
import { CaptureSettings } from '../../models/capture-models/capture-settings';
import { ExtractedStateService } from './extracted-state.service';

/*
Stores the board data as it is captured and send to server
*/

@Injectable({
  providedIn: 'root'
})
export class CaptureSettingsService {

  private captureState: CaptureSettings;

  constructor(extractedState: ExtractedStateService) {
    this.captureState = new CaptureSettings(extractedState);
  }

  public get(): CaptureSettings {
    return this.captureState;
  }

}
