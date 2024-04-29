import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass,faCirclePlus,faInbox,faCalendarDays ,faCalendarCheck} from '@fortawesome/free-solid-svg-icons';
import { EnvironmentEventComponent } from '../environment-event/environment-event.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule,EnvironmentEventComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faCirclePlus = faCirclePlus;
  faInbox = faInbox;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;
}
