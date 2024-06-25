import { Injectable } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  getTodaysDate() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  getCurrentTime() {
    let today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  isDateValid(dateString: string): boolean {
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      return false;
    }

    let date = new Date(dateString);
    let [year, month, day] = dateString.split('-').map(Number);

    if (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) {
      return true;
    } else {
      return false;
    }
  }

  isTimeValid(time: string): boolean {
    let timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time) ? true : false;
  }
}
