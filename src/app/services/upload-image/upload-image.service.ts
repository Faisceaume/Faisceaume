import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';

import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
    
  /** Data for upload-image component. */
  fileUrl: string;

  constructor(private fireStorage: AngularFireStorage) { }

  /**
   * Add a file in the database.
   * @param {string} folder The folder in which to store the file.
   * @param {File} file The file.
   * @returns {Promise<string>} The promise; contain the file URL in case of success.
   */
  uploadFile(folder: string, file: File): Promise<string> {
    return new Promise<string>( (resolve, reject) => {
      const uniqueFileName = Date.now().toString() + '_' + file.name; // Two files can not have the same name and extension (avoid problems for get / delete a image)
      const storageRef = this.fireStorage.storage.ref(folder).child(uniqueFileName);
      const uploadTask = storageRef.put(file);
      
      uploadTask.on('state_changed', (snapshot: any) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done.`);
        switch (snapshot.state) {
          case 'paused': // was firebase.storage.TaskState.PAUSED
            console.log('Upload is paused.'); break;
          case 'running': // was firebase.storage.TaskState.RUNNING
            console.log('Upload is running.'); break;
          }
        }, (error: any) => {
          console.log(`ERROR: failed to upload the file. ${error}.`);
          reject();
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then( (downloadURL: string) => {
          resolve(downloadURL);
        });
      });
    });
  }

  /**
   * Delete a file by his URL.
   * @param {string} url The URL of the file.
   */
  deleteFile(url: string): void {
    if (url) {
      const storageRef = this.fireStorage.storage.refFromURL(url);
      storageRef.delete()
      .then( () => {
        console.log('Image deleted.');
      })
      .catch( error => {
        console.error(`ERROR: failed to delete the image. ${error}.`);
      });
    } else {
      console.error(`ERROR: params url is incorrect: ${url}.`);
    }
  }
}
