import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SavingService {
  private goalsUrl = `${environment.apiUrl}/savings/goals`;
  private rulesUrl = `${environment.apiUrl}/savings/rules`;

  constructor(private http: HttpClient) {}

  createGoal(
    name: string,
    description: string,
    targetAmount: number,
  ): Observable<any> {
    return this.http.post(this.goalsUrl, { name, description, targetAmount });
  }

  getGoals(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.goalsUrl}/list/${userId}`);
  }

  deposit(savingGoalId: string, amount: number): Observable<any> {
    return this.http.put(`${this.goalsUrl}/${savingGoalId}/deposit`, amount);
  }

  withdraw(savingGoalId: string, amount: number): Observable<any> {
    return this.http.put(`${this.goalsUrl}/${savingGoalId}/withdraw`, amount);
  }

  createRule(
    savingGoalId: string,
    type: string,
    percentage: number | null,
    amount: number | null,
    frequency: string | null,
  ): Observable<any> {
    return this.http.post(this.rulesUrl, {
      type,
      percentage,
      amount,
      savingGoalId,
      frequency,
    });
  }
}
