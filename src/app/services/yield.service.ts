import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { YieldRequest, YieldResponse } from '../models/yield.model';

@Injectable({
  providedIn: 'root'
})
export class YieldService {
  constructor(private http: HttpClient) { }

  calculateYield(payload: YieldRequest): Observable<YieldResponse> {
    return this.http.post<YieldResponse>(`${environment.apiUrl}/yield`, payload);
  }
}
