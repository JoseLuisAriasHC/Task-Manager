import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para el if, for y style en html
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import {
  faHashtag,
  faCirclePlus,
  faArrowLeftLong,
} from '@fortawesome/free-solid-svg-icons';
// Services
import { ModalService } from '../services/modal/modal.service';
import { AppToastService } from '../services/toast/app-toast.service';
import { EnvironmentService } from '../services/environment/environment.service';
// Modesl
import { Task } from '../models/task.model';
import { Environment } from '../models/environment.model';


@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  faHashtag = faHashtag;
  faCirclePlus = faCirclePlus;
  faArrowLeftLong = faArrowLeftLong;

  @Input() claseCSS: string | undefined;

  @ViewChild('dateInput') dateInput: ElementRef | undefined;

  taskObj: Task = new Task();
  environmentList: Environment[] = [];
  today: string | undefined;

  constructor(
    private el: ElementRef,
    private modalService: ModalService,
    private toastService: AppToastService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    // obtener la lista de environments
    this.environmentService
      .getList()
      .subscribe((environments) => (this.environmentList = environments));
    // obtener la fecha de hoy
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    let year = today.getFullYear();

    this.today = `${year}-${month}-${day}`;
  }

  // Para que Angular trabaje mejor en los bucles dinamicos
  trackByEnvironmentId(index: number, environment: Environment): string {
    return environment.id;
  }

  changeEnvironment(environmentId: string, event: string) {
    this.taskObj.environment = environmentId;
    this.taskObj.event = event;
    this.backModal();
  }

  addTask() {
    if (
      this.taskObj.description.trim() != '' &&
      this.taskObj.date.trim() != ''
    ) {
      let errorMessage = this.TaskErrorHandler();
      if (errorMessage == '') {
      } else {
        this.toastService.show('Error al añadir tarea', errorMessage);
      }
      console.log(this.taskObj);
    } else {
      this.toastService.show(
        'Error al añadir tarea',
        'Una tarea debe de tener por lo menos una descripcióin y una fecha.'
      );
    }
  }

  TaskErrorHandler(): string {
    let error = this.isDateValid();
    if (error != '') {
      return error;
    }
    if (this.taskObj.time) {
      error = this.isTimeValid();
      if (error != '') {
        return error;
      }
    }

    if (this.taskObj.priority) {
      if (this.taskObj.priority < 0 || this.taskObj.priority > 3) {
        return 'La prioridad solo puede ser un valor entre el 0 y el 3.';
      }
    }

    return error;
  }

  isDateValid(): string {
    let dateString = this.taskObj.date;
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      return 'La fecha no es válida. Debe estar en el formato YYYY-MM-DD.';
    }

    let date = new Date(dateString);
    let [year, month, day] = dateString.split('-').map(Number);

    if (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) {
      return '';
    } else {
      return 'Debes introducir una fecha válida';
    }
  }

  isTimeValid(): string {
    let timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return timeRegex.test(this.taskObj.time)
      ? ''
      : 'La hora no es válida. Debe estar en el formato HH:MM.';
  }

  focusDateInput() {
    if (this.dateInput) {
      this.dateInput.nativeElement.focus();
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string) {
    this.modalService.openModal(this.el, idModal);
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);
    // this.eventInput.nativeElement.value = '';
    console.log(this.taskObj);
  }

  backModal() {
    this.modalService.backModal(this.el, 'addTaskModal');
  }
}
