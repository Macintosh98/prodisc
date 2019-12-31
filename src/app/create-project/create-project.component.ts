import { Component, OnInit } from '@angular/core';
import { AprojectService } from './aproject.service';
import { Router , ActivatedRoute } from '@angular/router';
import { FormControl , FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  submitted: boolean;
  showSuccessMessage: boolean;
  message : any;
  projectForm ;

  constructor(private aprojectService: AprojectService , 
              private router: Router ,
              private route : ActivatedRoute,
              private formBuilder: FormBuilder){
  }

   ngOnInit() {
    this.projectForm = this.formBuilder.group({
      $key : null , 
      name : ['', Validators.required],
      description : ['', Validators.required],
      language : ['', Validators.required],
      platform : ['', [Validators.required]],
    })
  }

  onSubmit() 
  {
    this.submitted = true;
    let key : string;
  
    if (this.projectForm.valid) 
    {
      if (this.projectForm.get('$key').value == null)
      { 
        key = this.aprojectService.insertcproject(this.projectForm.value);
        this.router.navigate(['workspace'] , { queryParams:{ id : key}} )
      }
      
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 3000);
      this.submitted = false;
      this.projectForm.reset();
    }
  }

  reset() 
  {
    this.submitted = false;
    this.projectForm.reset();
  }
  get f() { return this.projectForm.controls; }
}
