import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response';
import { APIClientService } from '../common/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private _apiService: APIClientService) { }

  public confirmMigration(token: string):Observable<ApiResponse> {
    return this._apiService.get(`/firebase/migrate/${token}`);
  }

  public migrationAvailable(userId:number):Observable<ApiResponse> {
    return this._apiService.get(`/firebase/available/${userId}`);
  }

}
