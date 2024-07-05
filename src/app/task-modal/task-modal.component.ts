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
// ng-bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Services
import { ModalService } from '../services/modal/modal.service';
import { AppToastService } from '../services/toast/app-toast.service';
import { EnvironmentService } from '../services/environment/environment.service';
import { TaskService } from '../services/task/task.service';
import { ToastModule } from '../services/toast/toast.module';
import { UtilsService } from '../services/utils/utils.service';
// Modesl
import { Task } from '../models/task.model';
import { Environment } from '../models/environment.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    NgbTooltipModule,
    ToastModule,
  ],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css',
})
export class TaskModalComponent {
  faHashtag = faHashtag;
  faCirclePlus = faCirclePlus;
  faArrowLeftLong = faArrowLeftLong;

  @Input() claseCSS: string | undefined;
  @Input() date: string | undefined;

  @ViewChild('dateInput') dateInput: ElementRef | undefined;

  taskObj: Task = new Task();
  environmentList: Environment[] = [];
  minDate: string | undefined;
  minTime: string | undefined;

  constructor(
    private el: ElementRef,
    private modalService: ModalService,
    private toastService: AppToastService,
    private environmentService: EnvironmentService,
    private taskService: TaskService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // obtener la lista de environments
    this.environmentService
      .getList()
      .subscribe((environments) => (this.environmentList = environments));
    // obtener la fecha de hoy
    this.minDate = this.utilsService.getTodaysDate();
    // Obtener la hora actual
    this.minTime = this.utilsService.getCurrentTime();
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
      let data = this.TaskErrorHandler();
      if (!data['error']) {
        this.taskService.addTask(this.taskObj);
        this.closeModal();
      } else {
        this.toastService.show('Error al añadir tarea', data['message']);
      }
    } else {
      this.toastService.show(
        'Error al añadir tarea',
        'Una tarea debe de tener por lo menos una descripcióin y una fecha.'
      );
    }
  }

  TaskErrorHandler() {
    let data = { error: false, message: '' };

    if (!this.utilsService.isDateValid(this.taskObj.date)) {
      return { error: true, message: 'La fecha no es válida. Debe estar en el formato YYYY-MM-DD.' };
    }

    if (this.taskObj.time && !this.utilsService.isTimeValid(this.taskObj.time)) {
      return { error: true, message: 'La hora no es válida. Debe estar en el formato HH:MM.' };
    }

    if (this.taskObj.priority && (this.taskObj.priority < 0 || this.taskObj.priority > 3)) {
      return { error: true, message: 'La prioridad solo puede ser un valor entre el 0 y el 3.' };
    }

    return data;
  }

  onTimeChange() {
    if (
      this.minTime &&
      this.taskObj.date == this.minDate &&
      this.taskObj.time < this.minTime
    ) {
      this.toastService.show(
        'Error en la Hora',
        'No puede seleccionar un tiempo anterior al actual.'
      );
      this.taskObj.time = '';
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string) {
    if (this.date && this.taskObj.date == '') {
      this.taskObj.date = this.date;
    }
    this.modalService.openModal(this.el, idModal);
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);
    this.taskObj = new Task();
  }

  backModal() {
    this.modalService.backModal(this.el, 'addTaskModal');
  }
}
