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

  removeTask(id: string) {
    const tasks = this.taskListSubject.getValue();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    this.taskListSubject.next(updatedTasks);
    localStorage.setItem('tableTask', JSON.stringify(updatedTasks));
  }

  updateTask(
    idToUpdate: string,
    updatedData: Partial<Task>
  ): void {
    const tasks = this.taskListSubject.value;
    const index = tasks.findIndex((env) => env.id === idToUpdate);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedData };
      localStorage.setItem('tableTask', JSON.stringify(tasks));
      this.taskListSubject.next(tasks);
    } else {
      console.error('ID no encontrado');
    }
  }

  private removeObsoleteTasks(tasks: Task[]): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= today;
    });
  }
  
  getTaskListSorted(tasks: Task[]): OrganizedTasks {
    this.removeObsoleteTasks(tasks);
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
  
  getTaskListByDescription(tasks: Task[], description: string): OrganizedTasks {
    this.removeObsoleteTasks(tasks);
    const filteredTasks = tasks.filter(task => 
      task.description.toLowerCase().includes(description.toLowerCase())
    );
  
    return filteredTasks.reduce((acc, task) => {
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
