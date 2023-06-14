import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ApiResponse } from '../../../../core/models/api-response';
import { FirebaseService } from '../../../../core/services/business/firebase.service';

@Component({
  selector: 'm-migration-status',
  templateUrl: './migration-status.component.html',
  styleUrls: ['./migration-status.component.scss']
})
export class MigrationStatusComponent implements OnInit {

  token:string;
  result:any;

  constructor(private firebaseService: FirebaseService, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.token = this.data.token;

    // this.firebaseService.confirmMigration(this.token).subscribe( (response:ApiResponse) => {

    //   console.log(response);
    //   this.result = response.data;

    // }, err => {
    //   console.warn(err);
    //   this.result = err;
    // } );

  }

}
