import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ToastContainerComponent } from '../../toast-container/toast-container.component';

@NgModule({
  declarations: [ToastContainerComponent],
  imports: [CommonModule,FontAwesomeModule],
  exports: [ToastContainerComponent]
})
export class ToastModule {}
