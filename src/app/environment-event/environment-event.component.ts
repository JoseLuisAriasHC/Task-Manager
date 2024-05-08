import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap'; // Importa el módulo NgbModule
import {
  faSquarePlus,
  faHashtag,
  faPlus,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { empty } from 'rxjs';


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
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;

  EnvironmentObj: Environment = new Environment();
  infoPopoverPlacement: PlacementArray = ['end'];
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // cambiar la dirección del popover del modal según el tamaño de la pantalla
  ngOnInit(): void {
    const screenWidth = window.innerWidth;
    this.infoPopoverPlacement = screenWidth < 1024 ? 'end' : 'start';
  }

  // Abrir manualmente el modal con su backdrop
  openModal() {
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    this.el.nativeElement.appendChild(backdrop);
    this.el.nativeElement.querySelector('.modal').classList.toggle('showModal');
  }

  // Cerrar manualmante el modal y eliminar su backdrop
  closeModal() {
    this.el.nativeElement.querySelector('.modal').classList.toggle('showModal');
    const backdrop = this.el.nativeElement.querySelector('.modal-backdrop');
    this.el.nativeElement.removeChild(backdrop);
  }

  // Crear dinamicamente los elementos event
  addEvent(nameEvenet: string){
    // Obtener el contenedor de eventos y el input
    const eventsContainer = this.el.nativeElement.querySelector('#eventsContainer');
    if (eventsContainer ) {
      if (nameEvenet && nameEvenet.trim() !== '') {
        // Crear el elemento span
        const badgeSpan = this.renderer.createElement('span');
        this.renderer.addClass(badgeSpan, 'badge');
        this.renderer.addClass(badgeSpan, 'text-bg-primary');
        this.renderer.addClass(badgeSpan, 'position-relative');
        this.renderer.addClass(badgeSpan, 'event-span');
        this.renderer.addClass(badgeSpan, 'me-3');
        this.renderer.addClass(badgeSpan, 'mt-1');
  
        // Crear el elemento span interno
        const innerSpan = this.renderer.createElement('span');
        const text = this.renderer.createText(nameEvenet);
        this.renderer.appendChild(innerSpan, text);
  
        // Agregar el elemento span interno al elemento span principal
        this.renderer.appendChild(badgeSpan, innerSpan);
  
        // Agregar el elemento span al contenedor de eventos
        this.renderer.appendChild(eventsContainer, badgeSpan);
      } else {
      console.error('EL input nameEvent esta vacio o no se encuentra en el DOM');
      }
    }else{
      console.error('El contenedor de eventos no se encontró en el DOM.');
    }
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

