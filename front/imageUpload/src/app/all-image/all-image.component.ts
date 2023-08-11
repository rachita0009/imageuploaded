import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { image } from '../image';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-all-image',
  templateUrl: './all-image.component.html',
  styleUrls: ['./all-image.component.css']
})
export class AllImageComponent implements OnInit {
  images:image[]=[];
  private  imageSubscription!: Subscription 

  constructor(private imageservice:ImageService) { }

  ngOnInit(): void {
    this.imageservice.getImages();
    this.imageSubscription = this.imageservice.getImageStream().subscribe((images:image[])=>{
     this.images = images
  }
    )}

    ngOnDestroy(){
      this.imageSubscription.unsubscribe();
    }

}
