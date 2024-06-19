import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el if, for y style en html
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import { faClock, faPenToSquare, faCalendar} from '@fortawesome/free-regular-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
// ng-bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Models
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task } from '../models/task.model';
// Services
import { TaskService, OrganizedTasks } from '../services/task/task.service';
// Pipes
import { DateFormatPipe } from '../pipes/dateFormat/date-format.pipe';
import { EnvironmentService } from '../services/environment/environment.service';
import { Environment } from '../models/environment.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, TaskModalComponent ,DateFormatPipe,NgbTooltipModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent {
  faClock = faClock;
  faHashtag = faHashtag;
  faPenToSquare = faPenToSquare;
  faCalendar = faCalendar;
  claseCSS = 'add-task-main';

  taskList: Task[] = [];
  sortedTaskList: OrganizedTasks = {};
  constructor(private renderer: Renderer2, private taskService: TaskService, private environmentService: EnvironmentService) {}

  ngOnInit(): void {
    // Obtener la listas de Task
    this.taskService.getList().subscribe((tasks) => {
      this.taskList = tasks;
      this.sortedTaskList = this.taskService.organizeTasksByDateAndEnvironment(this.taskList);
    });
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

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

  getEnvironment(id: string){
    return this.environmentService.getByID(id);
  }

  getColorEvent(environment: Environment | undefined, nameEvent: string){
    if (environment) {
      let index = environment.events.indexOf(nameEvent);
      return environment.colors[index];
    }
    return '';
  }
}
