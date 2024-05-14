import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {
  faSquarePlus,
  faHashtag,
  faPlus,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { AppToastService } from '../app-toast.service';
import { ToastModule } from '../app.module';

@Component({
  selector: 'app-environment-event',
  standalone: true,
  imports: [FontAwesomeModule,NgbModule,NgbDatepickerModule,FormsModule,ToastModule],
  templateUrl: './environment-event.component.html',
  styleUrl: './environment-event.component.css',
})

export class EnvironmentEventComponent {
  // iconos
  faSquarePlus = faSquarePlus;
  faHashtag = faHashtag;
  faPlus = faPlus;
  faCircleInfo = faCircleInfo;

  @ViewChild('nameEnvironment') environmentInput!: ElementRef;
  @ViewChild('nameEvent') eventInput!: ElementRef;
  @ViewChild('eventsContainer') eventsContainer!: ElementRef;

  EnvironmentObj: Environment = new Environment();
  infoPopoverPlacement: PlacementArray = ['end'];
  constructor(private el: ElementRef, private renderer: Renderer2,private toastService: AppToastService) {}
  
  // Crear dinamicamente los elementos event
  addEvent(){
    // Obtener el contenedor de eventos y el input value
    let nameEvent = this.eventInput.nativeElement.value.trim();
    if (this.eventsContainer.nativeElement ) {
      if (nameEvent !== '') {
        // Crear badge button 
        const badgeButton = this.renderer.createElement('button');
        this.renderer.addClass(badgeButton, 'badge');
        this.renderer.addClass(badgeButton, 'text-bg-primary');
        this.renderer.addClass(badgeButton, 'position-relative');
        this.renderer.addClass(badgeButton, 'event-span');
        this.renderer.listen(badgeButton,'click',(event) => this.deleteEvent(event))
  
        // Crear span interno
        const span = this.renderer.createElement('span');
        const text = this.renderer.createText('# ' + nameEvent);
        this.renderer.appendChild(span, text);
  
        // Agregar span interno al elemento span principal
        this.renderer.appendChild(badgeButton, span);
        this.renderer.appendChild(this.eventsContainer.nativeElement, badgeButton);

        // guardar su valor en el events de la clase environments
        this.EnvironmentObj.events.push(nameEvent);
        // Resetear value del input
        this.eventInput.nativeElement.value = '';
      } else {
        this.toastService.show('Error: Nombre del evento', 'Introduce el nombre del evento.','error',10000);
      }
    }else{
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
      let index = this.EnvironmentObj.events.indexOf(nameEvent);
      this.EnvironmentObj.events.splice(index,1);
      this.renderer.removeChild(this.eventsContainer.nativeElement, button);
    } else{
      console.error('El elemento span del button no se encuentra en el DOM.');
    }
  }
  // Guardar EnvironmentObj en BD local
  saveEnvironment(){
    // Guardar el nombre del Environment en el Obj
    if (this.environmentInput.nativeElement.value.trim() != '' &&  this.EnvironmentObj.events.length > 0) {
      this.EnvironmentObj.name = this.environmentInput.nativeElement.value;
      const localStore = localStorage.getItem('tableEnvironments');
      if (localStore !== null) {
        console.log("asd ");
        
      } else {
        let environmentArray = [];
        environmentArray.push(this.EnvironmentObj);
        localStorage.setItem('tableEnvironments',JSON.stringify(environmentArray));
      }
    } else {
      this.toastService.show('Faltan datos', 'Debes introducir el nombre del entorno y almenos un evento.','error',10000);

    }

  }

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
    
    // Resetear el modal
    this.environmentInput.nativeElement.value = '';
    this.eventInput.nativeElement.value = '';
    this.eventsContainer.nativeElement.innerHTML  = ''
    // Resetear EnvironmentObj
    this.EnvironmentObj.name = '';
    this.EnvironmentObj.events = [];
    console.log(this.EnvironmentObj);
  }
}

export class Environment{
  name: string = '';
  events: string[] = [];
}

