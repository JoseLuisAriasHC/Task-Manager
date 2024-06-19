import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid'; // id único

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskListSubject: BehaviorSubject<Task[]> = new BehaviorSubject<
    Task[]
  >(this.list());

  constructor() {}

  list(): Task[] {
    const tableTasks = localStorage.getItem('tableTask');
    if (tableTasks != null) {
      return JSON.parse(tableTasks);
    }
    return [];
  }

  getList(): Observable<Task[]> {
    return this.taskListSubject.asObservable();
  }

  addTask(newTask: Task) {
    const task = this.taskListSubject.getValue();
    newTask.id = uuidv4();
    task.push(newTask);
    this.taskListSubject.next(task);
    localStorage.setItem('tableTask', JSON.stringify(task));
  }

  organizeTasksByDateAndEnvironment(tasks: Task[]): OrganizedTasks {
    return tasks.reduce((acc, task) => {
      const date = task.date;
      const env = task.environment || 'Others';
      
      if (!acc[date]) {
        acc[date] = {};
      }
  
      if (!acc[date][env]) {
        acc[date][env] = [];
      }
  
      acc[date][env].push(task);
      return acc;
    }, {} as OrganizedTasks);
  }
}

export interface OrganizedTasks {
  [date: string]: {
    [environment: string]: Task[];
  };
}