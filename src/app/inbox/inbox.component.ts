import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para el if, for y style en html
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
// bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Models
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ToastModule } from '../services/toast/toast.module'; // Toast

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbTooltipModule,
    FormsModule,
    CommonModule,
    ToastModule,
    TaskModalComponent,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent {
  faClock = faClock;
  faHashtag = faHashtag;
  claseCSS = 'add-task-main';

  constructor(private renderer: Renderer2) {}

  // Elimiar una Tarea
  taskDone(event: Event) {
    let button = event.target as HTMLElement;
    this.renderer.addClass(button, 'active');
    let taskContainer = button.parentElement;
    this.renderer.setStyle(taskContainer, 'opacity', 0);

    setTimeout(() => {
      if (taskContainer) {
        this.renderer.removeChild(taskContainer.parentNode, taskContainer);
      }
    }, 600);
  }
}
