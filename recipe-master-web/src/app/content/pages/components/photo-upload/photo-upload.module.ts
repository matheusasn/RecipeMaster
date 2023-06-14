import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PhotoUploadComponent} from '../photo-upload/photo-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgxFileDropModule,
    ImageCropperModule,
    AngularCropperjsModule
  ],
  exports: [
    PhotoUploadComponent
  ],
  declarations: [
    PhotoUploadComponent
  ],
  entryComponents: [PhotoUploadComponent]
})
export class PhotoUploadModule { }
