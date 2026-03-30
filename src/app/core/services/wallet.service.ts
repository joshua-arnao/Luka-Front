import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WalletResponse } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private url = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  createWallet(userId: string): Observable<WalletResponse> {
    return this.http.post<WalletResponse>(this.url, { userId });
  }

  getWallet(userId: string): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${this.url}/${userId}`);
  }

  receiveMoney(walletId: string, amount: number): Observable<WalletResponse> {
    return this.http.put<WalletResponse>(
      `${this.url}/${walletId}/receive`,
      amount,
    );
  }

  sendMoney(walletId: string, amount: number): Observable<WalletResponse> {
    return this.http.put<WalletResponse>(
      `${this.url}/${walletId}/send`,
      amount,
    );
  }

  transferToSavings(
    walletId: string,
    amount: number,
  ): Observable<WalletResponse> {
    return this.http.put<WalletResponse>(
      `${this.url}/${walletId}/savings`,
      amount,
    );
  }

  getWalletByEmail(email: string): Observable<WalletResponse> {
    return this.http.get<WalletResponse>(`${this.url}/by-email/${email}`);
  }
}
