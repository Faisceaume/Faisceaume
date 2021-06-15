import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
    
  /** Data for upload-image component. */
  fileUrl: string;

  constructor(private fireStorage: AngularFireStorage) { }

  uploadFile(file: File) {
    return new Promise<any>( (resolve, reject) => {
      const uniqueFileName = Date.now().toString();
      const upload = this.fireStorage.storage.ref().child(`images/'${uniqueFileName}${file.name}`).put(file);
      //const upload = this.angularStorage.storage.ref().child('membersImages/' + uniqueFileName + file.name).put(file);

      upload.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done.`);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused.'); break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running.'); break;
          }
        }, error => {
          console.log(`ERROR: failed to upload the file. ${error}.`);
          reject();
        }, () => {
          upload.snapshot.ref.getDownloadURL().then( downloadURL => {
          resolve(downloadURL);
        });
      });
    });
  }

  deletePhoto(url: string): void {
    const storageRef = this.fireStorage.storage.refFromURL(url);
    storageRef.delete()
    .then( () => {
      console.log('Image deleted.');
    })
    .catch( error => {
      console.error(`ERROR: failed to delete the image. ${error}`);
    });
  }
}
