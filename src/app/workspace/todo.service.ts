import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})

export class TodoService 
{ 
  todoList : any;
  projectKey : any;
  path:any

  constructor(private firebase: AngularFireDatabase , private data : DataService) {  

    this.data.currentMessage$.subscribe(message => {
     this.projectKey = message
      this.path = 'projects/'+this.projectKey+'/ToDoList'
      this.todoList = this.firebase.list(this.path);    
    });
  }
  
  form = new FormGroup({
    $key: new FormControl(null),
    Task: new FormControl('') 
  });

  getTodo() 
  {
    this.todoList = this.firebase.list(this.path);
    return this.todoList.snapshotChanges();
  }

  setStatus($key :string , status :string)
  {
    this.firebase.database.ref(this.path).child($key).update({
      Status : status
    })
  }

  insertTodo(todo) 
  {
    this.todoList.push({
     Task: todo.Task ,
     Status : 'Added'
    });
  }

  populateForm(todo) 
  {
    this.form.setValue(todo);
  }

  deleteTodo($key: string) 
  {
    this.todoList.remove($key);
  }
}
