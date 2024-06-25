import { Component, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faCirclePlus,
  faInbox,
  faCalendarDays,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { EnvironmentEventComponent } from '../environment-event/environment-event.component';
import { Router, RouterLink } from '@angular/router';
import { ModalService } from '../services/modal/modal.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FontAwesomeModule,
    EnvironmentEventComponent,
    RouterLink,
    TaskModalComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  faMagnifyingGlass = faMagnifyingGlass;
  faCirclePlus = faCirclePlus;
  faInbox = faInbox;
  faCalendarDays = faCalendarDays;
  faCalendarCheck = faCalendarCheck;

  claseCSS = 'btn-info w-100 text-start btn-add';

  constructor(private el: ElementRef, private modalService: ModalService,private router: Router) {}

  searchTask(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const description = inputElement.value.trim();

    if (description) {
      this.router.navigate(['/inbox', description]);
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string) {
    this.modalService.openModal(this.el, idModal);
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);
  }

  backModal() {
    this.modalService.backModal(this.el, 'addTaskModal');
  }
}
