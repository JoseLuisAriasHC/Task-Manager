import { Routes } from '@angular/router';
import { EventComponent } from './event/event.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { InboxComponent } from "./inbox/inbox.component";
import { CalendarComponent } from "./calendar/calendar.component";

export const routes: Routes = [
  { path: 'event-list/:id', component: EventComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'inbox/:searchBy', component: InboxComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: '**', pathMatch: 'full', component: NotfoundComponent },
];
