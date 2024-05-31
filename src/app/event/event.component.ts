import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHashtag, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router'; // Para leer el id de la Url
import { Subscription } from 'rxjs'; // Para detectar cambios en la Url
import { CommonModule } from '@angular/common'; // Para el if o for en html
import { Environment } from '../environment-event/environment-event.component'; // Para usar el Obj Environment
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; // Tooltip
import { ModalService } from '../global/modal/modal.service';
import { AppToastService } from '../global/toast/app-toast.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, NgbTooltipModule],
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
  paramSubscription: Subscription | undefined;
  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private toastService: AppToastService,
  ) {}

  ngOnInit(): void {
    // Leer la url para poder cambiar el Environment 
    this.paramSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        const environment = Environment.getByID(id);
        if (environment !== undefined) {
          this.environmentObj = environment;
        } else {
          // this.router.navigate(['/not-found']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  addEvent() {
    let nameEvent = this.eventInput.nativeElement.value.trim();
    if (nameEvent !== '') {
      this.environmentObj.events.push(nameEvent);
      this.environmentObj.colors.push(this.colorInput.nativeElement.value);
      Environment.update(this.environmentObj.id, this.environmentObj);
      this.closeModal();
    }else{
      this.toastService.show(
        'Error: Nombre del evento',
        'Introduce el nombre del evento.',
        'error',
        10000
      );
    }
  }

  // Abrir manualmente el modal con su backdrop
  openModal(idModal: string) {
    this.modalService.openModal(this.el, idModal);
  }

  // Cerrar manualmante el modal y resetear valores
  closeModal() {
    this.modalService.closeModal(this.el);

    this.eventInput.nativeElement.value = '';
  }
}
