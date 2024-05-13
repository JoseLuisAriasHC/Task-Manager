// toast-container.component.ts
import { Component } from '@angular/core';
import { AppToastService, ToastInfo } from '../app-toast.service';
import { faBomb, } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'


@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {
  faBomb = faBomb;
  faThumbsUp = faThumbsUp;

  constructor(public toastService: AppToastService) { }

  removeToast(toast: ToastInfo) {
    this.toastService.remove(toast);
  }
}
