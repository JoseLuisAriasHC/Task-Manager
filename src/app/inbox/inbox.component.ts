import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
// fortawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // iconos fontawesome
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faHashtag, faCirclePlus, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
// bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Services
import { ModalService } from '../services/modal/modal.service';
import { AppToastService } from '../services/toast/app-toast.service';
import { Task } from '../models/task.model';
// Modulos

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [FontAwesomeModule,NgbTooltipModule,FormsModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent {
  faClock = faClock;
  faHashtag = faHashtag;
  faCirclePlus = faCirclePlus;
  faArrowLeftLong = faArrowLeftLong;

  taskObj: Task = new Task();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private modalService: ModalService,
    private toastService: AppToastService
  ) {}

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

  addTask() {}

  backModal(){
    this.modalService.backModal(this.el, 'addTaskModal');
  }
}
