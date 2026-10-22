import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { addIcons } from 'ionicons';

import { 
  navigateOutline, 
  locateOutline, 
  playOutline, 
  stopOutline, 
  documentTextOutline, 
  downloadOutline 
} from 'ionicons/icons';

addIcons({
  'navigate-outline': navigateOutline,
  'locate-outline': locateOutline,
  'play-outline': playOutline,
  'stop-outline': stopOutline,
  'document-text-outline': documentTextOutline,
  'download-outline': downloadOutline
});

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));