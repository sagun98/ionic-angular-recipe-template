import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  selectedImage: string; 
  usePicker = false; 
  @Input() showPreview =false;

  constructor(private platform: Platform) { }
  @Output() imagePick = new EventEmitter<string | File>();

  ngOnInit() {
    if (this.platform.is('mobile') && !this.platform.is('hybrid') || !this.platform.is('desktop')){
      this.usePicker = true;
    }

  }

  onFileChosen(event: Event){
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return; 
    }
    const fr = new FileReader(); 
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl; 
      this.imagePick.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }

  onPickImage(){
    if (! Capacitor.isPluginAvailable('Camera')){
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality:50,
      source: CameraSource.Prompt,
      correctOrientation:true, 
      width:200, 
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.selectedImage = image.dataUrl; 
      this.imagePick.emit(image.dataUrl);
    }).catch(err => {
      console.log(err);
      if (this.filePickerRef){
        this.filePickerRef.nativeElement.click();
      }
      return false; 
    });

  }

}
