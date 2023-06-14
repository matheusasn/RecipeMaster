import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { CpBaseComponent } from '../../common/cp-base/cp-base.component';
import { CpLoadingService } from '../../../../core/services/common/cp-loading.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'recipe-image-crop',
  templateUrl: './recipe-image-crop.component.html',
  styleUrls: ['./recipe-image-crop.component.scss']
})
export class RecipeImageCropComponent extends CpBaseComponent implements OnInit {

  private data:any;
  photo:any;
  croppedPhoto:any;
  cropBoxData;
  canvasData;
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  config:any;
  options:any;

  constructor(private _dialog: MatDialogRef<RecipeImageCropComponent>, _cdr: ChangeDetectorRef, _loading: CpLoadingService, @Inject(MAT_DIALOG_DATA) private _data: any) {
    super(_loading, _cdr);
    this.data = _data;
    this.options = _data.options?_data.options:{};
  }

  ngOnInit() {

    try {
      this.photo = this.data.photo;
    }
    catch(e) {
      console.log(e);
    }

    this.config = {
      dragMode: 'move',
      aspectRatio: this.options.aspectRatio?this.options.aspectRatio:3/2,
      autoCropArea: 0.9,
      guides: false,
      cropBoxMovable: true,
      toggleDragModeOnDblclick: false,
      minContainerWidth: 50,
      minContainerHeight: 50,
			checkOrientation: false,
			zoomable: true,
      crop: function(ev) {
        console.log(ev.detail.width, ev.detail.height, ev);
      }
    };

  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  doOk() {

    this.cropBoxData = this.angularCropper.cropper.getCropBoxData();
    this.canvasData = this.angularCropper.cropper.getCanvasData();

    this.croppedPhoto = this.angularCropper.cropper.getCroppedCanvas({
      // imageSmoothingEnabled: true,
      // imageSmoothingQuality: 'high',
      // fillColor: '#fff',
    }).toDataURL('image/png', 1);
    this.angularCropper.cropper.destroy();
    this._dialog.close({
      croppedPhoto: this.croppedPhoto
    });


    // this.croppedPhoto = this.angularCropper.cropper.getCroppedCanvas().toBlob((blob) => {

    //   this.angularCropper.cropper.destroy();

    //   this._dialog.close({
    //     croppedPhoto: blob
    //   });

    // });

  }

}
