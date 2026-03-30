import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TransactionRequest,
  TransactionResponse,
} from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private url = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  transfer(request: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.url}/transfer`, request);
  }

  getHistory(walletId: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(
      `${this.url}/history/${walletId}`,
    );
  }
}
