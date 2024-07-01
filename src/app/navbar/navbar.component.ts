import { Component, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faCirclePlus,
  faInbox,
  faCalendarDays,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
// Component
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { EnvironmentEventComponent } from '../environment-event/environment-event.component';
// Services
import { ModalService } from '../services/modal/modal.service';
import { UtilsService } from '../services/utils/utils.service';

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
  today: string | undefined;

  constructor(private el: ElementRef, private modalService: ModalService,private router: Router, private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.today = this.utilsService.getTodaysDate();
  }


  searchTask(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const description = inputElement.value.trim();

    if (description) {
      this.router.navigate(['/inbox', 'description_' + description]);
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
