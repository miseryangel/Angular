import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  postFeedback(fb: Feedback):Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };

    return this.http.post<Feedback>(baseURL + 'feedback', fb, httpOptions)
          .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
