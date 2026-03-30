import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { WalletService } from '../../core/services/wallet.service';
import { TransactionService } from '../../core/services/transaction.service';
import { WalletResponse } from '../../core/models/wallet.model';
import { TransactionResponse } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  wallet: WalletResponse | null = null;
  transactions: TransactionResponse[] = [];
  loading = true;
  sending = false;
  searching = false;
  error = '';
  success = '';
  showSendForm = false;

  // Paso 1 — buscar contacto
  receiverEmail = '';
  receiverWallet: WalletResponse | null = null;
  receiverName = '';

  // Paso 2 — monto
  amount = 0;
  step = 1;

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId() || '';
    this.walletService.getWallet(userId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loadHistory(wallet.walletId);
      },
    });
  }

  loadHistory(walletId: string): void {
    this.transactionService.getHistory(walletId).subscribe({
      next: (txs) => {
        this.transactions = txs;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  searchContact(): void {
    if (!this.receiverEmail) return;
    this.searching = true;
    this.error = '';

    this.walletService.getWalletByEmail(this.receiverEmail).subscribe({
      next: (wallet) => {
        this.receiverWallet = wallet;
        this.receiverName = this.receiverEmail.split('@')[0];
        this.step = 2;
        this.searching = false;
      },
      error: () => {
        this.error = 'Usuario no encontrado.';
        this.searching = false;
      },
    });
  }

  onTransfer(): void {
    if (!this.receiverWallet || !this.amount) return;
    this.sending = true;
    this.error = '';

    this.transactionService
      .transfer({
        receiverWalletId: this.receiverWallet.walletId,
        amount: this.amount,
      })
      .subscribe({
        next: () => {
          this.success = '¡Transferencia exitosa!';
          setTimeout(() => (this.success = ''), 3000);
          this.resetForm();
          const userId = this.authService.getUserId() || '';
          this.walletService.getWallet(userId).subscribe({
            next: (wallet) => {
              this.wallet = wallet;
              this.loadHistory(wallet.walletId);
            },
          });
          this.sending = false;
        },
        error: () => {
          this.error = 'Error al realizar la transferencia.';
          this.sending = false;
        },
      });
  }

  resetForm(): void {
    this.receiverEmail = '';
    this.receiverWallet = null;
    this.receiverName = '';
    this.amount = 0;
    this.step = 1;
    this.showSendForm = false;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getInitials(email: string): string {
    return email?.substring(0, 2).toUpperCase() || 'LU';
  }
}
