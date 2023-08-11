import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { image } from '../image';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css']
})
export class AddImageComponent implements OnInit {
  form!: FormGroup;
  image!:image;
  imageData!: any;
  constructor(private imageservice: ImageService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(null),
    });
  }

  onFileSelect(event: Event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.form.patchValue({ image: file });
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as any;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
   console.log('image create')
    this.imageservice.addImage(this.form.value.image);
    this.form.reset();
    this.imageData = null;
    // alert("image created successfully")
  }

}
