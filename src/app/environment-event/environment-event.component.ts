import { Component, ElementRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSquarePlus, faHashtag,faTrash,faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-environment-event',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './environment-event.component.html',
  styleUrl: './environment-event.component.css',
})
export class EnvironmentEventComponent {
  faSquarePlus = faSquarePlus;
  faHashtag = faHashtag;
  faTrash = faTrash;
  faPlus = faPlus;
  constructor(private el: ElementRef) {}

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
}
