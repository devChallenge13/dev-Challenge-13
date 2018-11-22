import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DxButtonModule,
  DxSelectBoxModule,
  DxTabPanelModule,
  DxToastModule,
  DxTreeViewModule,
  DxDataGridModule,
  DxTreeViewComponent,
  DxSlideOutModule,
  DxToolbarModule,
  DxSwitchModule,
  DxTemplateModule,
  DevExtremeModule,
  DxTabsModule,
  DxFileUploaderModule
} from 'devextreme-angular';

/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import 'hammerjs';

import { MatDialog,
  MatDialogRef,
  MatSnackBar,
  MatMenuModule,
  MatButtonModule,
  MatSidenavModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatSlideToggleModule,
  MatDividerModule,
  MatProgressBarModule } from '@angular/material';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    DevExtremeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDividerModule,

    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    // ...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {}
