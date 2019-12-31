import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})

export class TodoListComponent implements OnInit 
{  
  todoArray = [];
  showDeletedMessage: boolean;

  constructor(private todoService: TodoService) {
  }
  
  // Keep eye on the wheather task's are added or not.
  // If task is added then update the todo list in html.

  ngOnInit() 
  {
    this.todoService.getTodo().subscribe(
      list => {
        this.todoArray = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
      });
  }

  // Update the status accordingly.
  //If status is completed which indicates completion of task then delete the task
 
  onChange(val:any , key : any)  
  {
    let status = val['srcElement']['value']
    this.todoService.setStatus(key , status )
    if(status == 'Completed')  
      this.onDelete(key)
  }

  // $key is the key of task
  // Ask for confirmation defore deleting the task.

  onDelete($key) 
  {
    if (confirm('Task Completed ?')) 
    {
      this.todoService.deleteTodo($key);
      this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  } 
} 