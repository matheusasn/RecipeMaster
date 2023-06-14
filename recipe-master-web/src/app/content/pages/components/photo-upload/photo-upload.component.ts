import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ImageCompressService, ResizeOptions, IImage } from  'ng2-image-compress';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatDialog } from '@angular/material';
import { RecipeImageCropComponent } from '../recipe-image-crop/recipe-image-crop.component';
import * as _ from 'lodash';
import { PlanService } from '../../../../core/services/business/plan.service';
import { RolePermission, RECIPE_PHOTO_LIMIT, PerfilPermission, PerfilEnum } from '../../../../core/models/security/perfil.enum';
import { ApiResponse } from '../../../../core/models/api-response';
import { RecipeService } from '../../../../core/services/business/recipe.service';
import { Recipe } from '../../../../core/models/business/recipe';
import { APP_CONFIG } from "../../../../config/app.config";
import { TranslateService } from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';

function compressImage(src, options: ResizeOptions) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {

			var outputFormat = options.Resize_Type;
			var quality = options.Resize_Quality || 50;
			var mimeType = 'image/jpeg';
			if (outputFormat !== undefined && outputFormat === 'png') {
					mimeType = 'image/png';
			}
			var maxHeight = options.Resize_Max_Height || 300;
			var maxWidth = options.Resize_Max_Width || 250;

			var height = img.height;
			var width = img.width;

			// calculate the width and height, constraining the proportions
			if (width > height) {
					if (width > maxWidth) {
							height = Math.round(height *= maxWidth / width);
							width = maxWidth;
					}
			}
			else {
					if (height > maxHeight) {
							width = Math.round(width *= maxHeight / height);
							height = maxHeight;
					}
			}

			var cvs = document.createElement('canvas');
			cvs.width = width;
			cvs.height = height;

			var ctx = cvs.getContext('2d').drawImage(img, 0, 0, width, height);
			var newImageData = cvs.toDataURL(mimeType, quality / 100);
			res(newImageData);
    }
    img.onerror = error => rej(error);
  })
}

@Component({
  selector: 'm-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {

  form =  new FormGroup({ photo: new FormControl('') });
  processedImages:any = [];
  @Input() icon: string;
  @Input() photo:string;
  @Input() photoUrl:string;
  @Output() photoChange = new EventEmitter();
  public files: NgxFileDropEntry[] = [];
  @Input() checkLimit: boolean = false;
  @Input() recipe:Recipe;
  @Input() customClass:string;
  @Input() cropOtions:any;
  @Input() dropContainer:string = 'drop-container';

  dropZoneClassName:string = 'ngx-file-drop__drop-zone';

  canUpload:boolean = true;

  constructor(
    private _dialogIngredientInfo: MatDialog,
    private planService: PlanService,
    private recipeService: RecipeService,
    private translate: TranslateService,
		private imageCompress: NgxImageCompressService){}

  ngOnInit() {
    this.checkCanUpload();

    if(!_.isNil(this.recipe)) {
      this.photoUrl = this.recipe.photoUrl;
    }

  }

	handleImgError(event) {
		this.photo = null;
		this.photoUrl = null;
	}

  doAssinatura() {
    this.planService.noPlanAlert(PerfilPermission.getMessage(RolePermission.PHOTO_UNLIMITED));
  }

  private async checkCanUpload() {

    this.canUpload = ! await this.isLimitReached(false);

  }

  private async isLimitReached(showAlert:boolean = true) {

    if(this.checkLimit) {

      if( ! this.planService.hasPermission(RolePermission.PHOTO_UNLIMITED, false) ) {

        let response:ApiResponse = await this.recipeService.getTotalRecipeWithPhoto(this.recipe&&this.recipe.id?this.recipe.id:-1).toPromise();

        if( _.isNumber(response.data) && response.data >= RECIPE_PHOTO_LIMIT ) {

          if( this.recipe && this.recipe.id && this.recipe.photoUrl && this.recipe.photoUrl.length != 0 ) {
            return false;
          }

          this.planService.hasPermission(RolePermission.PHOTO_UNLIMITED, showAlert);

          return true;
        }

      }

    }
    else {
       console.log("não VERIFICAR limit de FOTOS")
    }

    return false;

  }

	cropImage(_photo) {

		let cropImageRef = this._dialogIngredientInfo.open(RecipeImageCropComponent, {
			data: {
        photo: _photo,
        options: this.cropOtions
			}
		});

		cropImageRef.afterClosed().subscribe( (response) => {
		if( _.isNil(response) ) {
			return;
		}

			try {
        _photo = response.croppedPhoto;
        this.photoChange.emit(_photo);

        this.photoUrl = _photo;

			}
			catch(e) {
				console.log(e);
			}
		});

	}


  private onChange(files:any) {
    let images: Array<IImage> = [];

    let opt :ResizeOptions = {
      Resize_Max_Height:512,
      Resize_Max_Width:512,
      Resize_Quality:92,
      Resize_Type: "png"
    }

		this.imageCompress.compressFile(URL.createObjectURL(files[0]), -2, 70, 92).then(result => {
			compressImage(result, opt).then(compressed => {
				this.cropImage(compressed)
			})
		})

  }

  public async dropped(files: NgxFileDropEntry[]) {

    let limitReached:boolean = await this.isLimitReached();

    if(limitReached) {
      return;
    }

    this.files = files;

		for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          this.onChange([file]);

        });

      }
      else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }

    }

	}

	public fileOver(event){
		console.log(event);
	}

	public fileLeave(event){
		console.log(event);
	}

}
