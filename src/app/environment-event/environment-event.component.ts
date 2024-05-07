import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // Importa el módulo NgbModule
import {
  faSquarePlus,
  faHashtag,
  faTrash,
  faPlus,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-environment-event',
  standalone: true,
  imports: [FontAwesomeModule,NgbModule,NgbDatepickerModule,FormsModule],
  templateUrl: './environment-event.component.html',
  styleUrl: './environment-event.component.css',
})
export class EnvironmentEventComponent {
  faSquarePlus = faSquarePlus;
  faHashtag = faHashtag;
  faTrash = faTrash;
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;

  EnvironmentObj: Environment = new Environment();
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  openModal() {
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    this.el.nativeElement.appendChild(backdrop);
    this.el.nativeElement.querySelector('.modal').classList.toggle('showModal');
  }

  closeModal() {
    this.el.nativeElement.querySelector('.modal').classList.toggle('showModal');
    const backdrop = this.el.nativeElement.querySelector('.modal-backdrop');
    this.el.nativeElement.removeChild(backdrop);
  }

  addEVent() {
    console.log("si da");

    const modalBody = this.el.nativeElement.querySelector('.modal-body');

    // Div Row
    const row = this.renderer.createElement('div');
    this.renderer.addClass(row, 'row');

    const divCol1 = this.renderer.createElement('div');
    this.renderer.addClass(divCol1, 'col');
    this.renderer.addClass(divCol1, 'col-md-10');

    // Input Event
    const input = this.renderer.createElement('input');
    this.renderer.addClass(input, 'form-control');
    this.renderer.addClass(input, 'mb-2');
    this.renderer.setAttribute(input, 'type', 'text');
    this.renderer.setAttribute(input, 'placeholder', 'Nombre del evento');

    const divCol2 = this.renderer.createElement('div');
    this.renderer.addClass(divCol2, 'col');
    this.renderer.addClass(divCol2, 'col-md-2');

    // Delete Btn
    const button = this.renderer.createElement('button');
    this.renderer.addClass(button, 'btn');
    this.renderer.addClass(button, 'btn-danger');

    // Icon FaTrash
    const icon = this.renderer.createElement('fa-icon');
    this.renderer.addClass(icon, 'm-1');
    this.renderer.setAttribute(icon, 'icon', 'trash');

    // Add elements to the DOM
    this.renderer.appendChild(button, icon);
    this.renderer.appendChild(divCol1, input);
    this.renderer.appendChild(divCol2, button);
    this.renderer.listen(button, 'click', () => this.deleteEvent(row));

    this.renderer.appendChild(row, divCol1);
    this.renderer.appendChild(row, divCol2);
    this.renderer.appendChild(modalBody, row);
  }

  deleteEvent(event: MouseEvent | HTMLElement) {
    if (event instanceof MouseEvent) {
      const button = event.target as HTMLElement;
      const row = button.closest('.row');
      if (row) {
        row.remove();
      }
    } else if (event instanceof HTMLElement) {
      const row = event as HTMLElement;
      row.remove();
    }
  }

  saveEnvironment(){
    console.log("guardar entorno");
    console.log(this.EnvironmentObj);
    
  }
}

export class Environment{
  name = '';
  events = [];
}

