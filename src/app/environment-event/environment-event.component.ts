import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {
  faSquarePlus,
  faHashtag,
  faPlus,
  faCircleInfo,
  faArrowLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { AppToastService } from '../app-toast.service';
import { ToastModule } from '../toast.module';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-environment-event',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    ToastModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './environment-event.component.html',
  styleUrl: './environment-event.component.css',
})
export class EnvironmentEventComponent {
  // iconos
  faSquarePlus = faSquarePlus;
  faHashtag = faHashtag;
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;
  faArrowLeftLong = faArrowLeftLong;

  @ViewChild('nameEnvironment') environmentInput!: ElementRef;
  @ViewChild('colorEvent') colorEvent!: ElementRef;
  @ViewChild('nameEvent') eventInput!: ElementRef;
  @ViewChild('eventsContainer') eventsContainer!: ElementRef;

  infoPopoverPlacement: PlacementArray = ['end'];
  environmentObj: Environment = new Environment();
  environmentList: Environment[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private toastService: AppToastService
  ) {}

  ngOnInit(): void {
    // localStorage.removeItem('tableEnvironments');
    // Obtener lista de environments
    this.environmentList = Environment.list();

    // cambiar la dirección del popover del modal según el tamaño de la pantalla
    const screenWidth = window.innerWidth;
    this.infoPopoverPlacement = screenWidth < 1024 ? 'end' : 'start';
  }

  // Crear dinamicamente los elementos event
  addEvent() {
    // Obtener el contenedor de eventos y el input value
    let nameEvent = this.eventInput.nativeElement.value.trim();
    if (this.eventsContainer.nativeElement) {
      if (nameEvent !== '') {
        // Crear badge button
        const badgeButton = this.renderer.createElement('button');
        this.renderer.addClass(badgeButton, 'badge');
        this.renderer.addClass(badgeButton, 'text-bg-primary');
        this.renderer.addClass(badgeButton, 'position-relative');
        this.renderer.addClass(badgeButton, 'event-span');
        this.renderer.setStyle(
          badgeButton,
          'border',
          '1px solid ' + this.colorEvent.nativeElement.value
        );
        this.renderer.listen(badgeButton, 'click', (event) =>
          this.deleteEvent(event)
        );

        // Crear span interno
        const span = this.renderer.createElement('span');
        const spanText = this.renderer.createText('# ' + nameEvent);
        this.renderer.setStyle(
          span,
          'color',
          this.colorEvent.nativeElement.value
        );
        this.renderer.appendChild(span, spanText);

        // Agregar span interno al elemento span principal
        this.renderer.appendChild(badgeButton, span);
        this.renderer.appendChild(
          this.eventsContainer.nativeElement,
          badgeButton
        );

        // Guardar el nombre y color del evento
        this.environmentObj.events.push(nameEvent);
        this.environmentObj.colors.push(this.colorEvent.nativeElement.value);
        // Resetear value del input
        this.eventInput.nativeElement.value = '';
        this.colorEvent.nativeElement.value = '#CB3434';
      } else {
        this.toastService.show(
          'Error: Nombre del evento',
          'Introduce el nombre del evento.',
          'error',
          10000
        );
      }
    } else {
      console.error('El contenedor de eventos no se encontró en el DOM.');
    }
  }

  // Borrar el event seleccionado
  deleteEvent(event: Event) {
    // Obtener el button y el span
    const button = event.currentTarget as HTMLElement;
    let span = button.querySelector('span');

    if (span && span.textContent) {
      let nameEvent = span.textContent;
      let index = this.environmentObj.events.indexOf(nameEvent);
      this.environmentObj.events.splice(index, 1);
      this.environmentObj.colors.splice(index, 1);
      this.renderer.removeChild(this.eventsContainer.nativeElement, button);
    } else {
      console.error('El elemento span del button no se encuentra en el DOM.');
    }
  }

  // Guardar environmentObj en BD local
  saveEnvironment() {
    if (
      this.environmentInput.nativeElement.value.trim() != '' &&
      this.environmentObj.events.length > 0
    ) {
      // Guardar el nombre del Environment en el Obj
      const tableEnvironments = localStorage.getItem('tableEnvironments');
      if (tableEnvironments !== null) {
        let tableArray = JSON.parse(tableEnvironments);
        this.environmentObj.id = uuidv4();
        tableArray.push(this.environmentObj);
        this.environmentList = tableArray;
        localStorage.setItem('tableEnvironments', JSON.stringify(tableArray));
      } else {
        let tableArray = [];
        this.environmentObj.id = uuidv4();
        tableArray.push(this.environmentObj);
        this.environmentList = tableArray;
        localStorage.setItem('tableEnvironments', JSON.stringify(tableArray));
      }
      this.closeActualModal();
      this.removeBackDrop();
      this.environmentObj = new Environment();
    } else {
      this.toastService.show(
        'Faltan datos',
        'Debes introducir el nombre del entorno y almenos un evento.',
        'error',
        10000
      );
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string) {
    const existingBackdrop =
      this.el.nativeElement.querySelector('.modal-backdrop');
    if (!existingBackdrop) {
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      this.el.nativeElement.appendChild(backdrop);
    }
    const existingModal = this.el.nativeElement.querySelector('.showModal');
    if (existingModal) {
      existingModal.classList.toggle('showModal');
    }
    this.el.nativeElement
      .querySelector('.modal#' + idModal)
      .classList.toggle('showModal');
  }

  // Cerrar manualmante el modal y eliminar su backdrop
  closeModal() {
    this.closeActualModal();
    this.removeBackDrop();

    // Resetear el modal
    this.environmentInput.nativeElement.value = '';
    this.eventInput.nativeElement.value = '';
    this.eventsContainer.nativeElement.innerHTML = '';
    // Resetear environmentObj
    this.environmentObj = new Environment();
  }

  backModal() {
    this.closeActualModal();
    this.el.nativeElement
      .querySelector('.modal#environmentModal')
      .classList.toggle('showModal');
  }

  closeActualModal() {
    const existingModal = this.el.nativeElement.querySelector('.showModal');
    existingModal.classList.toggle('showModal');
  }

  removeBackDrop() {
    const backdrop = this.el.nativeElement.querySelector('.modal-backdrop');
    this.el.nativeElement.removeChild(backdrop);
  }
}

export class Environment {
  id: string = '';
  name: string = '';
  colors: string[] = [];
  events: string[] = [];

  static list(): Environment[] {
    const tableEnvironments = localStorage.getItem('tableEnvironments');
    if (tableEnvironments != null) {
      return JSON.parse(tableEnvironments);
    }
    return [];
  }

  static findEnvironmentById(id: string): Environment | undefined {
    let list: Environment[] = [];
    list = Environment.list();
    return list.find(env => env.id === id);
  }
  
}