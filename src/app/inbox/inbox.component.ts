import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent {
  faClock = faClock;
  faHashtag = faHashtag;
}
