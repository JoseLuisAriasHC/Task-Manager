import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor() {}

  openModal(el: ElementRef, idModal: string) {
    const existingBackdrop = el.nativeElement.querySelector('.modal-backdrop');
    if (!existingBackdrop) {
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      el.nativeElement.appendChild(backdrop);
    }
    const existingModal = el.nativeElement.querySelector('.showModal');
    if (existingModal) {
      existingModal.classList.toggle('showModal');
    }
    el.nativeElement
      .querySelector('.modal#' + idModal)
      .classList.toggle('showModal');
  }

  closeModal(el: ElementRef) {
    this.closeActualModal(el);
    this.removeBackDrop(el);
  }

  closeActualModal(el: ElementRef) {
    const existingModal = el.nativeElement.querySelector('.showModal');
    existingModal.classList.toggle('showModal');
  }

  removeBackDrop(el: ElementRef) {
    const backdrop = el.nativeElement.querySelector('.modal-backdrop');
    el.nativeElement.removeChild(backdrop);
  }

  backModal(el: ElementRef, idModal: string) {
    this.closeActualModal(el);
    el.nativeElement
      .querySelector('.modal#' + idModal)
      .classList.toggle('showModal');
  }
}
