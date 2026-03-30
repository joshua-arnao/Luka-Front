import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationResponse } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private url = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.url}/${userId}`);
  }

  markAsRead(notificationId: string): Observable<NotificationResponse> {
    return this.http.put<NotificationResponse>(
      `${this.url}/${notificationId}/read`,
      {},
    );
  }
}
