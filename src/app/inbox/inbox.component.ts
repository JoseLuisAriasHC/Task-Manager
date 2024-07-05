import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el if, for y style en html
import { ActivatedRoute } from '@angular/router';
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import {
  faClock,
  faPenToSquare,
  faCalendar,
} from '@fortawesome/free-regular-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
// ng-bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Models
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Task } from '../models/task.model';
import { Environment } from '../models/environment.model';
// Services
import { TaskService, OrganizedTasks } from '../services/task/task.service';
import { ModalService } from '../services/modal/modal.service';
import { UtilsService } from '../services/utils/utils.service';
import { EnvironmentService } from '../services/environment/environment.service';
import { DateFormatPipe } from '../pipes/dateFormat/date-format.pipe';
// Pipes
import { AppToastService } from '../services/toast/app-toast.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    TaskModalComponent,
    DateFormatPipe,
    NgbTooltipModule,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent {
  faClock = faClock;
  faHashtag = faHashtag;
  faPenToSquare = faPenToSquare;
  faCalendar = faCalendar;
  claseCSS = 'add-task-main';

  @ViewChild('description') descriptionInput: ElementRef | undefined;

  taskList: Task[] = [];
  sortedTaskList: OrganizedTasks = {};
  updateTask = new Task();
  data: string[] = [];
  minDate: string | undefined;
  minTime: string | undefined;

  constructor(
    private renderer: Renderer2,
    private taskService: TaskService,
    private environmentService: EnvironmentService,
    private el: ElementRef,
    private modalService: ModalService,
    private utilsService: UtilsService,
    private toastService: AppToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener la listas de Task
    this.route.paramMap.subscribe((params) => {
      let searchBy = params.get('searchBy') || '';
      this.taskService.getList().subscribe((tasks) => {
        if (searchBy) {
          this.data = searchBy.split('_');
          switch (this.data[0]) {
            case 'date':
              this.sortedTaskList = this.taskService.getTaskListByDate(
                tasks,
                this.data[1]
              );
              break;
            case 'description':
              this.sortedTaskList = this.taskService.getTaskListByDescription(
                tasks,
                this.data[1]
              );
              break;
            case 'event':
              this.sortedTaskList = this.taskService.getTaskListByEvent(
                tasks,
                this.data[1],
                this.data[2]
              );
              break;
            default:
              this.sortedTaskList = this.taskService.getTaskListSorted(tasks);
              break;
          }
        } else {
          this.sortedTaskList = this.taskService.getTaskListSorted(tasks);
        }
      });
    });

    this.minDate = this.utilsService.getTodaysDate();
    this.minTime = this.utilsService.getCurrentTime();
  }

  hasTasks(): boolean {
    return Object.keys(this.sortedTaskList).some(
      (date) => Object.keys(this.sortedTaskList[date]).length > 0
    );
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  // Elimiar una Tarea
  taskDone(event: Event, task: Task) {
    let button = event.target as HTMLElement;
    this.renderer.addClass(button, 'active');
    let taskContainer = button.parentElement;
    if (taskContainer) {
      this.renderer.setStyle(taskContainer, 'opacity', 0);
    }
    setTimeout(() => {
      if (taskContainer) {
        this.taskService.removeTask(task.id);
      }
    }, 250);

    this.toastService.show(
      'Tarea completada',
      '¡Felicidades!, la tarea "' +
        task.description +
        '" se ha completado con éxito.',
      'success',
      4000
    );
  }

  getEnvironment(id: string) {
    return this.environmentService.getByID(id);
  }

  getColorEvent(environment: Environment | undefined, nameEvent: string) {
    if (environment) {
      let index = environment.events.indexOf(nameEvent);
      return environment.colors[index];
    }
    return '';
  }

  getPriorityClass(task: Task) {
    return `priority${task.priority}`;
  }

  changeTaskDescription() {
    if (this.descriptionInput) {
      this.updateTask.description = this.descriptionInput.nativeElement.value;
      this, this.taskService.updateTask(this.updateTask.id, this.updateTask);
      this.closeModal();
    } else {
      console.error('No se encuentra el descriptionInput en el DOM');
    }
  }

  onDateChange(event: Event, task: Task) {
    let inputDate = event.target as HTMLInputElement;
    let date = inputDate.value;
    if (this.utilsService.isDateValid(date)) {
      this.minDate = this.utilsService.getTodaysDate();
      if (date < this.minDate) {
        this.toastService.show(
          'Error al cambiar la fecha',
          'No se puede introducir una fecha menor al actual.'
        );
      } else {
        task.date = date;
        this.taskService.updateTask(task.id, task);
      }
    } else {
      this.toastService.show(
        'Error al cambiar la fecha',
        'No se ha introducido una fecha válida.'
      );
    }
  }

  onTimeChange(event: Event, task: Task) {
    this.minTime = this.utilsService.getCurrentTime();
    let inputTime = event.target as HTMLInputElement;
    let time = inputTime.value;
    if (this.minTime) {
      if (task.date == this.minDate) {
        if (time > this.minTime) {
          task.time = time;
          this.taskService.updateTask(task.id, task);
        } else {
          this.toastService.show(
            'Error al cambiar la hora',
            'No puede seleccionar un tiempo anterior al actual.'
          );
        }
      } else {
        task.time = time;
        this.taskService.updateTask(task.id, task);
      }
    } else {
      console.error('No se ha definido un tiempo mínimo.');
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string, task: Task) {
    this.modalService.openModal(this.el, idModal);
    if (this.descriptionInput) {
      this.updateTask = task;
      this.descriptionInput.nativeElement.value = this.updateTask.description;
    } else {
      console.error('No se encuentra el descriptionInput en el DOM');
    }
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);
    this.updateTask = new Task();
  }
}
