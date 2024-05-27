import { Routes } from '@angular/router';
import { EventComponent } from './event/event.component';

export const routes: Routes = [
    { path: '', redirectTo: '/heroes-list', pathMatch: 'full' },
    { path: 'event-list', component: EventComponent },
  ];
