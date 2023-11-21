import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { VideoCaptureComponent } from './components/layout/play-components/video-capture/video-capture.component';
import { InteractiveTetrisBoardComponent } from './components/tetris/interactive-tetris-board/interactive-tetris-board.component';
import { TetrisBlockComponent } from './components/tetris/tetris-block/tetris-block.component';
import { AppRoutingModule } from './app-routing.module';
import {MatSliderModule} from '@angular/material/slider';
import { RootComponent } from './components/layout/root-components/root/root.component';
import { PlayPageComponent } from './components/layout/play-components/play-page/play-page.component';
import { AnalyzePageComponent } from './components/layout/analyze-page/analyze-page.component';
import { PuzzlesPageComponent } from './components/layout/puzzles-page/puzzles-page.component';
import { LeaderboardPageComponent } from './components/layout/leaderboard-page/leaderboard-page.component';
import { ProfilePageComponent } from './components/layout/profile-page/profile-page.component';
import { HomePageComponent } from './components/layout/home-page/home-page.component';
import { PageLinkComponent } from './components/layout/root-components/page-link/page-link.component';
import { ButtonComponent } from './components/BLOCK/button/button.component';
import { ImageComponent } from './components/BLOCK/image/image.component';
import { MorePageComponent } from './components/layout/more-components/more-page/more-page.component';
import { PageButtonComponent } from './components/layout/more-components/page-button/page-button.component';
import { BoardCreationPageComponent } from './components/layout/board-creation-components/board-creation-page/board-creation-page.component';
import { NextBoxComponent } from './components/tetris/next-box/next-box.component';
import { CheckboxComponent } from './components/BLOCK/checkbox/checkbox.component';
import { ButtonSmallComponent } from './components/BLOCK/button-small/button-small.component';
import { FixedSizeImageComponent } from './components/BLOCK/fixed-size-image/fixed-size-image.component';
import { ButtonBigComponent } from './components/BLOCK/button-big/button-big.component';
import { SubsectionComponent } from './components/BLOCK/subsection/subsection.component';
import { SectionComponent } from './components/BLOCK/section/section.component';
import { CalibratePageComponent } from './components/layout/calibrate-components/calibrate-page/calibrate-page.component';
import { TetrisPanelComponent } from './components/BLOCK/tetris-panel/tetris-panel.component';
import { TetrisPanelItemComponent } from './components/BLOCK/tetris-panel-item/tetris-panel-item.component';
import { EvalBarComponent } from './components/BLOCK/eval-bar/eval-bar.component';
import { ThresholdInputComponent } from './components/layout/calibrate-components/threshold-input/threshold-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingSliderComponent } from './components/BLOCK/rating-slider/rating-slider.component';
import { DebugGameComponent } from './components/layout/debug-game/debug-game.component';
import { RatingSubsectionComponent } from './components/BLOCK/rating-subsection/rating-subsection.component';
import { GameSummaryComponent } from './components/layout/play-components/game-summary/game-summary.component';
import { AccuracyPanelComponent } from './components/layout/play-components/accuracy-panel/accuracy-panel.component';
import { GameHistoryPanelComponent } from './components/layout/play-components/game-history-panel/game-history-panel.component';
import { TagComponent } from './components/BLOCK/tag/tag.component';
import { LeaderboardPanelComponent } from './components/layout/play-components/leaderboard-panel/leaderboard-panel.component';
import { EligibilityItemComponent } from './components/layout/play-components/eligibility-item/eligibility-item.component';
import { PlayCalibrateComponent } from './components/layout/play-calibrate/play-calibrate.component';
import { RatingTotalsComponent } from './components/layout/play-components/rating-totals/rating-totals.component';
import { HowToPlayComponent } from './components/layout/play-components/how-to-play/how-to-play.component';
import { DiscordButtonComponent } from './components/BLOCK/discord-button/discord-button.component';
import { OnLoginComponent } from './components/layout/on-login/on-login.component';
import { AnimatedDigitComponent } from './components/BLOCK/animated-digit/animated-digit.component';
import { AnimatedCounterComponent } from './components/BLOCK/animated-counter/animated-counter.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { GameAnalysisPageComponent } from './components/layout/game-analysis-components/game-analysis-page/game-analysis-page.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 4000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    VideoCaptureComponent,
    InteractiveTetrisBoardComponent,
    TetrisBlockComponent,
    RootComponent,
    PlayPageComponent,
    AnalyzePageComponent,
    PuzzlesPageComponent,
    LeaderboardPageComponent,
    ProfilePageComponent,
    HomePageComponent,
    PageLinkComponent,
    ButtonComponent,
    ImageComponent,
    MorePageComponent,
    PageButtonComponent,
    BoardCreationPageComponent,
    NextBoxComponent,
    CheckboxComponent,
    ButtonSmallComponent,
    FixedSizeImageComponent,
    ButtonBigComponent,
    SubsectionComponent,
    SectionComponent,
    CalibratePageComponent,
    TetrisPanelComponent,
    TetrisPanelItemComponent,
    EvalBarComponent,
    ThresholdInputComponent,
    RatingSliderComponent,
    DebugGameComponent,
    RatingSubsectionComponent,
    GameSummaryComponent,
    AccuracyPanelComponent,
    GameHistoryPanelComponent,
    TagComponent,
    LeaderboardPanelComponent,
    EligibilityItemComponent,
    PlayCalibrateComponent,
    RatingTotalsComponent,
    HowToPlayComponent,
    DiscordButtonComponent,
    OnLoginComponent,
    AnimatedDigitComponent,
    AnimatedCounterComponent,
    GameAnalysisPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }