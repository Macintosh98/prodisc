import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database'
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from 'querystring';
import { Observable, Observer } from 'rxjs';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Injectable()
export class PaintService {

  freehand : any;
  attributes : any;
  status : any
  mysnaps : any
  coordinates : any
  base : any;

  shape : any;
  color : any;
  size : any;

  projectKey : any
  public canvas: HTMLCanvasElement = null
  public ctx: CanvasRenderingContext2D
  sx  : number;
  sy : number;

  snapshot : any;
  mouse = 'move';

  base64Image: any;

  constructor(private db: AngularFireDatabase ,  private router: Router )
    {
      this.color = 'black'
      this.shape = 'point'
      this.size = 5
    }

  initialize(mountPoint: HTMLElement , key) {
    this.canvas = mountPoint.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 750;
    this.canvas.height = 450;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    this.projectKey = key;
    this.CreateReference()
    this.base.child(`status`).set({
      status : 0
    });
    this.base.child(`attributes`).set({
      color : this.color ,
      size : this.size ,
      shape : this.shape
    });
  }

  CreateReference()
  {
   this.base = this.db.database.ref('projects').child(this.projectKey).child('sketch');
    const coordinatesRef = this.base.child(`coordinates`);    
    coordinatesRef.on('value', s => {this.coordinates = s.val()
      if(this.attributes)
        this.draw();
    });
  
    const shapeRef = this.base.child(`attributes`);    
    shapeRef.on('value', s => {this.attributes = s.val()
    });

    const freehandRef = this.base.child(`freehand`);    
    freehandRef.on('value', s => {this.freehand = s.val()
      if(this.attributes)
        this.draw();
    });

    const statusRef = this.base.child(`status`);    
    statusRef.on('value', s => {this.status = s.val()
      if(this.attributes)
        this.draw();
    });

    const snapshotRef = this.base.child(`snapshot`);    
    snapshotRef.on('value', s => {this.mysnaps = s.val()
    });
  }

  SetToDefault()
  { 
    this.base.child(`coordinates`).set({
      x1: 0 , 
      y1: 0 , 
      x2: 0 , 
      y2: 0 ,
    });

    this.base.child(`freehand`).set({
      x1 : 0 ,
      y1 : 0 ,
      x2 : 0 ,
      y2 : 0 
    });
  }

  Status( status : number) // status 0 -> dont draw status 1 -> draw
  {
    this.base.child(`status`).set({
      status : status
    });
  }

  FreeHand(clientX : number , clientY : number) // Pencil
  {
    
    if( this.status['status'] == 0)
    {
      this.base.child(`freehand`).set({
        x1 : clientX , 
        y1 : clientY ,
        x2 : clientX  , 
        y2 : clientY ,
      });  
    }
    else
    {
      this.base.child(`freehand`).set({
        x1: this.freehand['x2'] , 
        y1: this.freehand['y2'] ,
        x2 : clientX  , 
        y2 : clientY ,
      });  
    }
  }

  SetCoordinates(x1 : number , y1 : number, x2 : number , y2 : number)
  {
    this.base.child(`coordinates`).set({
      x1: x1 , 
      y1: y1 ,
      x2 : x2 , 
      y2 : y2 ,
    });
  }

  Attributes(color : string , size : number , shape : string)
  {
    this.base.child(`attributes`).set({
      color: color , 
      size : size ,
      shape : shape
    });
  }

  store( { clientX , clientY , event_name }) {
    
    if (event_name == 'down')
    {  
      this.Status(0);
      this.sx = clientX 
      this.sy = clientY

      this.SetToDefault()
    }
    else if (event_name == 'move')
    {
      this.Status(1)
    }
    else if (event_name == 'up')
    { 
      this.Status(1);
      this.mouse = 'up'
      this.SetCoordinates(this.sx , this.sy , clientX , clientY);
    }

    if (this.attributes['shape'] == 'freehand' || this.attributes['shape'] == 'eraser')
      this.FreeHand(clientX , clientY)
  }

  draw()
  {  
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.attributes['color'];
    this.ctx.lineWidth = this.attributes['size'];

    //Point
    if (this.attributes['shape'] == 'point')
    { 
      if (this.status['status'] == 1)
        this.ctx.arc(this.coordinates['x1'], this.coordinates['y1'], 0.5 , 0, Math.PI * 2, true);
    }

    // Line
    else if (this.attributes['shape'] == 'line')
    { 
      if (this.status['status'] == 1)
      { 
        this.ctx.moveTo(this.coordinates['x1'] , this.coordinates['y1']);
        this.ctx.lineTo(this.coordinates['x2'], this.coordinates['y2']);
        // if (this.mouse == 'move')
        //   this.restore()
      } 
    } 
    
    //Circle
    else if (this.attributes['shape'] == 'circle')
    { 
      if (this.status['status'] == 1)
      {
        var x1 = this.coordinates['x1']
        var x2 = this.coordinates['x2']
        var y1 = this.coordinates['y1']
        var y2 = this.coordinates['y2']

        var radius  = (Math.sqrt(Math.pow((x2 - x1) , 2)  + Math.pow((y2 - y1) , 2))) / 2
        var midX = (x1 + x2) / 2
        var midY = (y1 + y2) / 2

        this.ctx.arc(midX , midY , radius , 0, Math.PI * 2 , true);
      }
    }

    //Semi-Circle - up
    else if (this.attributes['shape'] == 'semicircleUp')
    { 
      if (this.status['status'] == 1)
      {
        var x1 = this.coordinates['x1']
        var x2 = this.coordinates['x2']
        var y1 = this.coordinates['y1']
        var y2 = this.coordinates['y2']

        var radius  = (Math.sqrt(Math.pow((x2 - x1) , 2)  + Math.pow((y2 - y1) , 2))) / 2
        var midX = (x1 + x2) / 2
        var midY = (y1 + y2) / 2

        this.ctx.arc(midX , midY , radius , 0, Math.PI , true);
      }
    }

    //Semi-Circle - down
    else if (this.attributes['shape'] == 'semicircleDown')
    { 
      if (this.status['status'] == 1)
      {
        var x1 = this.coordinates['x1']
        var x2 = this.coordinates['x2']
        var y1 = this.coordinates['y1']
        var y2 = this.coordinates['y2']

        var radius  = (Math.sqrt(Math.pow((x2 - x1) , 2)  + Math.pow((y2 - y1) , 2))) / 2
        var midX = (x1 + x2) / 2
        var midY = (y1 + y2) / 2

        this.ctx.arc(midX , midY , radius , 0, Math.PI , false);
      }
    }

    // Rectangle
    else if (this.attributes['shape']  == 'rectangle')
    { 
      
      if (this.status['status'] == 1)
      {
        var x1 = this.coordinates['x1']
        var x2 = this.coordinates['x2']
        var y1 = this.coordinates['y1']
        var y2 = this.coordinates['y2']

        var height  = y2 - y1;
        var width = x2 - x1;
        this.ctx.rect( x1 , y1 , width , height);
      }  
    }

    // Freehand
    else if (this.attributes['shape'] == 'freehand')
    {
      if (this.status['status'] == 1)
      {
        this.ctx.moveTo(this.freehand['x1'] , this.freehand['y1']);
        this.ctx.lineTo(this.freehand['x2'], this.freehand['y2']);
      }
    }

    //Eraser
    else if (this.attributes['shape'] == 'eraser')
    { 
      console.log("called me i am eraser")
      if (this.status['status'] == 1)
      {
        var x1 = this.freehand['x1']
        var y1 = this.freehand['y1']

        this.ctx.clearRect(x1 , y1 , this.attributes['size'] , this.attributes['size']);
      }
    }

    this.ctx.stroke();
  }

  clear() // Clear(clean out) whole canvas
  {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
  }

  eraser()
  { 
    this.Attributes('white' , 5 ,  'freehand');
  }

  delete() // Ask for confirmation then delete the project.
  { 
    if (confirm('Are You Sure?')) 
    {
      this.db.database.ref('projects').child(this.projectKey).remove();
      this.router.navigate(['/profile'])
    } 
  }

  takeSnapshot(image_name : string) // Take Snapshot of canvas and save it by image_name's name
  {   
      var image = this.canvas.toDataURL()
      this.base.child(`snapshot`).push({
        image : image ,
        image_name : image_name
      });
  }

  restore(imageUrl) // imageUrl is url format of the image.restore it and put it into canvas
  {    
        this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
          this.base64Image = 'data:image/jpg;base64,' + base64data;
        });
  }
  
  getBase64ImageFromURL(url: string) 
    {
      return Observable.create((observer: Observer<string>) => {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        if (!img.complete) {
          img.onload = () => {
            observer.next(this.getBase64Image(img));
            observer.complete();
          };
          img.onerror = (err) => {
            observer.error(err);
          };
        } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
        }
      });
  }
  
  getBase64Image(img: HTMLImageElement) 
  {
      this.ctx.drawImage(img, 0, 0);
      var dataURL = this.canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  selectedShape(shape) // Set the selected shape 
  {
    this.shape = shape;
    this.Attributes(this.color , this.size , this.shape);
  }

  selectedColor(color) // Set the selected color
  {
    this.color = color;
    this.Attributes(this.color , this.size , this.shape);
  }

  selectedSize(keycode: number) // Set the selected size +(increase) -(decrease)
  { 
    console.log(keycode)
    switch(keycode)
    {  
      case 43  :    if ( this.size < 20 ) // 43 --> + key
                        this.size += 2;
                     break;

      case 45  :    if ( this.size > 5 ) // 45 --> - key
                        this.size -= 2;
                      break;
    }
    this.Attributes(this.color , this.size , this.shape);
  }
}