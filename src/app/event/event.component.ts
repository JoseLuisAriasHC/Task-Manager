import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router'; // Para leer el id de la Url
import { CommonModule } from '@angular/common'; // Para el if o for en html
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHashtag, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
// bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Tooltip
// Services
import { ModalService } from '../services/modal/modal.service';
import { AppToastService } from '../services/toast/app-toast.service';
import { EnvironmentService } from '../services/environment/environment.service';
import { TaskService } from '../services/task/task.service';
// Models
import { Environment } from '../models/environment.model';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, NgbTooltipModule,RouterLink],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  faHashtag = faHashtag;
  faPlus = faPlus;
  faTrash = faTrash;

  @ViewChild('nameEvent') eventInput!: ElementRef;
  @ViewChild('colorEvent') colorInput!: ElementRef;

  environmentObj: Environment = new Environment();
  index = -1;

  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private toastService: AppToastService,
    private environmentService: EnvironmentService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Leer la url para poder cambiar el Environment
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        const environment = this.environmentService.getByID(id);
        if (environment !== undefined) {
          this.environmentObj = environment;
        } else {
          this.router.navigate(['**']);
        }
      }
    });
  }

  addEvent() {
    let nameEvent = this.eventInput.nativeElement.value.trim();
    if (nameEvent !== '') {
      this.environmentObj.events.push(nameEvent);
      this.environmentObj.colors.push(this.colorInput.nativeElement.value);
      this.environmentService.updateEnvironment(
        this.environmentObj.id,
        this.environmentObj
      );
      this.closeModal();
    } else {
      this.toastService.show(
        'Error: Nombre del evento',
        'Introduce el nombre del evento.',
        'error',
        10000
      );
    }
  }

  handleDelete() {
    this.index === -1 ? this.deleteEnvironment() : this.deleteEvent();
  }
  
  handleDeleteWithTask() {
    this.index === -1 ? this.deleteEnvironmentTask() : this.deleteEventTask();
  }
  
  deleteEnvironment() {
    this.removeEnvironmentAndNavigate();
    this.taskService.updateTasksEnvironment(this.environmentObj.id);
  }
  
  deleteEnvironmentTask() {
    this.removeEnvironmentAndNavigate();
    this.taskService.removeTasksByEnvironment(this.environmentObj.id);
  }
  
  deleteEvent() {
    this.taskService.updateTasksEnvironmentByEvent(
      this.environmentObj.id,
      this.environmentObj.events[this.index]
    );
    this.updateEnvironmentEvent();
  }
  
  deleteEventTask() {
    this.taskService.removeTasksByEnvironmentAndEvent(
      this.environmentObj.id,
      this.environmentObj.events[this.index]
    );
    this.updateEnvironmentEvent();
  }
  
  removeEnvironmentAndNavigate() {
    this.environmentService.removeEnvironment(this.environmentObj.id);
    this.closeModal();
    this.router.navigate(['/inbox']);
  }
  
  updateEnvironmentEvent() {
    this.environmentObj.events.splice(this.index, 1);
    this.environmentObj.colors.splice(this.index, 1);
    this.environmentService.updateEnvironment(
      this.environmentObj.id,
      this.environmentObj
    );
    this.closeModal();
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string, index: number = -1) {
    this.modalService.openModal(this.el, idModal);
    this.index = index;
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);
    this.eventInput.nativeElement.value = '';
  }
}
