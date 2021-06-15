import { Component, Input, OnInit } from '@angular/core';

import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';


@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  @Input() title: string;

  fileUrl: string;

  isFileOK = true;
  isFileUploading = false;
  isFileUploaded = false;
  errorMessages: string[] = [];

  constructor(private uploadImageService: UploadImageService) { }
  

  ngOnInit(): void {
    this.fileUrl = this.uploadImageService.fileUrl;
  }

  onUploadFile(file: File): void {
    this.isFileUploading = true;
    this.uploadImageService.uploadFile(file).then( (url: string) => {
      this.uploadImageService.fileUrl = url;
      this.isFileUploading = false;
      this.isFileUploaded = true;
    });
  }

  detectFile(event): void {
    const file: File = event.target.files[0];
    this.imageTreatment(file);
  }

  handleDrop(e): void {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    this.imageTreatment(file);
  }

  imageTreatment(file: File): void {
    this.getImageDimension(window.URL.createObjectURL(file)).then( dimension => {
      if (file.size < 90000 && dimension < 800) {
        this.onUploadFile(file);
        this.isFileOK = true;
      } else {
        this.isFileOK = false;
      }
      if (file.size >= 90000) {
          this.errorMessages.push('Le poids de l\'image doit être inférieur à 30 000 octets.');
      }
      if (dimension >= 800) {
        this.errorMessages.push('La dimension de l\'image doit être inférieure à 800px.');
      }
    });
  }
    
  getImageDimension(address: string): Promise<number> {
    const img = new Image();
    img.src = address;
    return new Promise<number>( (resolve, reject) => {
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        resolve(width);
      };
    });
  }


  onDeleteDrapImage() {
    this.uploadImageService.deletePhoto(this.uploadImageService.fileUrl);
    this.uploadImageService.fileUrl = null;
  }
}
