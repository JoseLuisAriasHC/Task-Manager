import { Component } from '@angular/core';
import { Router } from '@angular/router';
// fullcalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
// Services
import { TaskService } from '../services/task/task.service';
// Model
import { Task } from '../models/task.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {

  taskList: Task[] = [];
  events: any = null;

  constructor(private taskService: TaskService,private router: Router) {}

  ngOnInit(): void {
    // Obtener la lista de tareas
    this.taskService.getList().subscribe((tasks) => {
      this.taskList = tasks;
      this.setCalendarOptions();
    });
  }

  setCalendarOptions(): void {
    const events = this.taskList.map((task) => ({
      title: task.description,
      date: task.date
    }));

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      contentHeight: '84.9vh',
      locale: esLocale,
      dateClick: (arg) => this.handleDateClick(arg),
      events: events
    };
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    contentHeight: '84.9vh',
    locale: esLocale,
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.events
  };

  handleDateClick(arg: DateClickArg) {
    this.router.navigate(['inbox/date_'+arg.dateStr]);
  }
}
