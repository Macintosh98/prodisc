import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs'
import { mergeMap, takeUntil, switchMap } from 'rxjs/operators'
import { PaintService } from '../paint.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from 'angularfire2/database'
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({ 
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})

export class PaintComponent implements OnInit {
  
  projectKey : any;
  savedImages = []

  form = new FormGroup({
    image_name : new FormControl('') 
  });

  constructor(private paintSvc: PaintService,
             private elRef: ElementRef , 
             private db: AngularFireDatabase ,
             private data : DataService ){
              
              this.data.currentMessage$.subscribe(message => {
                this.projectKey = message
              }) 
            }

  ngOnInit(){
    this.paintSvc.initialize(this.elRef.nativeElement , this.projectKey)
    this.startPainting()

    this.db.list(`projects/${this.projectKey}/sketch/snapshot`).snapshotChanges().subscribe(
      list => {
        this.savedImages = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
      });
  }
  
  ngAfterViewInit() {
  }

  Clear()
  { 
    this.paintSvc.clear();
  }

  Delete()
  {
    this.paintSvc.delete();
  }

  Download()
  { 
    this.paintSvc.takeSnapshot(this.form.value.image_name)
    this.form.reset()
  }

  Upload(image)
  { 
    this.paintSvc.clear();
    this.paintSvc.restore(image);
  }

  DeleteImage(imageKey)
  {
    console.log(imageKey)
    this.db.list(`projects/${this.projectKey}/sketch/snapshot/${imageKey}`).remove()
  }

  Eraser()
  {
    this.paintSvc.eraser();
  }

  SelectShape(shape)
  { 
    this.paintSvc.selectedShape(shape)
  }

  SelectColor(color)
  {
    this.paintSvc.selectedColor(color)
  }
  private startPainting() {

    const { nativeElement } = this.elRef;
    const canvas = nativeElement.querySelector('canvas') as HTMLCanvasElement
    
    const move$ = fromEvent<MouseEvent>(canvas, 'mousemove')
    const down$ = fromEvent<MouseEvent>(canvas, 'mousedown')
    const up$ = fromEvent<MouseEvent>(canvas, 'mouseup')
    const keyboard$ = fromEvent<KeyboardEvent>(window, 'keypress')

    const paints$ = down$.pipe(
      mergeMap(down => move$.pipe(takeUntil(up$)))
      // mergeMap(down => move$)
    );
    
    //const offset = getOffset(canvas)
    
      paints$.subscribe((event) => {
        const offset = getOffset(canvas)
        const clientX = event.clientX - offset.left
        const clientY = event.clientY - offset.top
        const event_name = 'move'
        this.paintSvc.store( { clientX, clientY , event_name })
      });

      /*move$.subscribe((event ) => {
        const clientX = event.clientX - offset.left
        const clientY = event.clientY - offset.top
        this.paintSvc.store( { clientX, clientY })
      });

      up$.subscribe((event ) => {
        const clientX = event.clientX - offset.left
        const clientY = event.clientY - offset.top
        this.paintSvc.store( { clientX, clientY })
      });*/
      
      down$.subscribe((event) => {
        const offset = getOffset(canvas)
        const clientX = event.clientX - offset.left
        const clientY = event.clientY - offset.top
        const event_name = 'down'
        this.paintSvc.store( { clientX, clientY , event_name})
      });
      
      // move$.subscribe((event) => {
      //   const clientX = event.clientX - offset.left
      //   const clientY = event.clientY - offset.top
      //   const event_name = 'move'
      //   this.paintSvc.store( { clientX, clientY , event_name})
      // });

      up$.subscribe((event) => {
        const offset = getOffset(canvas)
        const clientX = event.clientX - offset.left
        const clientY = event.clientY - offset.top
        const event_name = 'up'
        this.paintSvc.store( { clientX, clientY , event_name})
      });

      keyboard$.subscribe((event) => {
        this.paintSvc.selectedSize(event.keyCode);
      });

    
  } 
}

function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

 return {
    top: rect.top ,
    left: rect.left
  }
}

