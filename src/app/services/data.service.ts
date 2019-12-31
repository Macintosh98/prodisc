import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new Subject<any>();
  currentMessage$ = this.messageSource.asObservable();

  constructor() { }

  sendMessage(message: any) {
    this.messageSource.next(message)
  }
}
