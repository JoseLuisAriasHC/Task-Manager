import { Routes } from '@angular/router';
import { EventComponent } from './event/event.component';

export const routes: Routes = [
    { path: 'event-list/:id', component: EventComponent },
  ];
