import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import {Environment} from "../environment-event/environment-event.component";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  faHashtag = faHashtag;

  environmentObj: Environment = new Environment();
  environmentList: Environment[] = [];

  ngOnInit(): void {
    // localStorage.removeItem('tableEnvironments');
    // Obtener lista de environments
    this.environmentList = Environment.list();
    
  }
}
