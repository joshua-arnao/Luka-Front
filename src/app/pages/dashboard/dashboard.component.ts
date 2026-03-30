import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { WalletService } from '../../core/services/wallet.service';
import { TransactionService } from '../../core/services/transaction.service';
import { NotificationService } from '../../core/services/notification.service';
import { WalletResponse } from '../../core/models/wallet.model';
import { TransactionResponse } from '../../core/models/transaction.model';
import { NotificationResponse } from '../../core/models/notification.model';
import { SavingService } from '../../core/services/saving.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  firstName = '';
  userId = '';
  wallet: WalletResponse | null = null;
  transactions: TransactionResponse[] = [];
  notifications: NotificationResponse[] = [];
  unreadCount = 0;
  loading = true;
  goals: any[] = [];

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private notificationService: NotificationService,
    private savingService: SavingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.firstName = this.authService.getFirstName() || 'Usuario';
    this.userId = this.authService.getUserId() || '';
    this.loadData();
  }

  loadData(): void {
    this.walletService.getWallet(this.userId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loadTransactions(wallet.walletId);
      },
      error: () => (this.loading = false),
    });

    this.notificationService.getNotifications(this.userId).subscribe({
      next: (notifs) => {
        this.notifications = notifs.slice(0, 3);
        this.unreadCount = notifs.filter((n) => !n.read).length;
      },
    });

    this.savingService.getGoals(this.userId).subscribe({
      next: (goals) => (this.goals = goals.slice(0, 2)),
    });
  }

  loadTransactions(walletId: string): void {
    this.transactionService.getHistory(walletId).subscribe({
      next: (txs) => {
        this.transactions = txs.slice(0, 3);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  getInitials(email: string): string {
    return email?.substring(0, 2).toUpperCase() || 'LU';
  }

  getProgress(current: number, target: number): number {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }
}
