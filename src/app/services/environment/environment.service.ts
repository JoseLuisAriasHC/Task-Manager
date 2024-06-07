import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environmentListSubject: BehaviorSubject<Environment[]> = new BehaviorSubject<Environment[]>(Environment.list());

  constructor() { }

  getList(): Observable<Environment[]> {
    return this.environmentListSubject.asObservable();
  }

  updateEnvironment(idToUpdate: string, updatedData: Partial<Environment>): void {
    const environments = this.environmentListSubject.value;
    const index = environments.findIndex(env => env.id === idToUpdate);
    if (index !== -1) {
      environments[index] = { ...environments[index], ...updatedData };
      localStorage.setItem('tableEnvironments', JSON.stringify(environments));
      this.environmentListSubject.next(environments); // Notifica a los suscriptores del cambio
    } else {
      console.error('ID no encontrado');
    }
  }

  addEnvironment(newEnvironment: Environment) {
    const environments = this.environmentListSubject.getValue();
    environments.push(newEnvironment);
    this.environmentListSubject.next(environments);
    localStorage.setItem('tableEnvironments', JSON.stringify(environments));
  }

  removeEnvironment(idToRemove: string) {
    const environments = this.environmentListSubject.getValue();
    const updatedEnvironments = environments.filter(env => env.id !== idToRemove);
    this.environmentListSubject.next(updatedEnvironments);
    localStorage.setItem('tableEnvironments', JSON.stringify(updatedEnvironments));
  }
}

export class Environment {
  id: string = '';
  name: string = '';
  colors: string[] = [];
  events: string[] = [];

  static list(): Environment[] {
    const tableEnvironments = localStorage.getItem('tableEnvironments');
    if (tableEnvironments != null) {
      return JSON.parse(tableEnvironments);
    }
    return [];
  }

  static getByID(id: string): Environment | undefined {
    let list: Environment[] = [];
    list = Environment.list();
    return list.find((env) => env.id === id);
  }
  
}
