import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass,faCirclePlus,faInbox,faCalendarDays ,faCalendarCheck,faList} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faCirclePlus = faCirclePlus;
  faInbox = faInbox;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;
  faList = faList;
}
