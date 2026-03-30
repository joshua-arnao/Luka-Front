import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SavingService } from '../../core/services/saving.service';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss',
})
export class SavingsComponent implements OnInit {
  goals: any[] = [];
  loading = true;
  showCreateForm = false;
  creating = false;
  error = '';
  success = '';

  newGoal = { name: '', description: '', targetAmount: 0 };
  newRule = {
    type: 'PERCENTAGE',
    percentage: 0,
    amount: 0,
    frequency: 'WEEKLY',
  };
  depositAmount: Record<string, number> = {};
  withdrawAmount: Record<string, number> = {};

  showModal = false;
  modalType: 'deposit' | 'withdraw' = 'deposit';
  selectedGoal: any = null;
  modalAmount = 0;

  constructor(
    private authService: AuthService,
    private savingService: SavingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    const userId = this.authService.getUserId() || '';
    this.savingService.getGoals(userId).subscribe({
      next: (goals) => {
        this.goals = goals;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  createGoal(): void {
    if (!this.newGoal.name || !this.newGoal.targetAmount) return;
    this.creating = true;
    this.error = '';

    this.savingService
      .createGoal(
        this.newGoal.name,
        this.newGoal.description,
        this.newGoal.targetAmount,
      )
      .subscribe({
        next: (goal) => {
          this.savingService;
          this.savingService
            .createRule(
              goal.savingGoalId,
              this.newRule.type,
              this.newRule.type === 'PERCENTAGE'
                ? this.newRule.percentage
                : null,
              this.newRule.type === 'SCHEDULED' ? this.newRule.amount : null,
              this.newRule.type === 'SCHEDULED' ? this.newRule.frequency : null,
            )
            .subscribe({
              next: () => {
                this.success = '¡Objetivo y regla creados!';
                setTimeout(() => (this.success = ''), 3000);
                this.showCreateForm = false;
                this.newGoal = { name: '', description: '', targetAmount: 0 };
                this.newRule = {
                  type: 'PERCENTAGE',
                  percentage: 0,
                  amount: 0,
                  frequency: 'WEEKLY',
                };
                this.creating = false;
                this.loadGoals();
              },
              error: () => {
                this.success = '¡Objetivo creado sin regla!';
                setTimeout(() => (this.success = ''), 3000);
                this.creating = false;
                this.loadGoals();
              },
            });
        },
        error: () => {
          this.error = 'Error al crear el objetivo.';
          setTimeout(() => (this.error = ''), 3000);
          this.creating = false;
        },
      });
  }

  deposit(goalId: string, amount: number): void {
    this.savingService.deposit(goalId, amount).subscribe({
      next: () => {
        this.success = '¡Depósito exitoso!';
        setTimeout(() => (this.success = ''), 3000);
        this.loadGoals();
      },
      error: () => {
        this.error = 'Error al depositar.';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  withdraw(goalId: string, amount: number): void {
    this.savingService.withdraw(goalId, amount).subscribe({
      next: () => {
        this.success = '¡Retiro exitoso!';
        setTimeout(() => (this.success = ''), 3000);
        this.loadGoals();
      },
      error: () => {
        this.error = 'Saldo insuficiente.';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  getProgress(current: number, target: number): number {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openModal(goal: any, type: 'deposit' | 'withdraw'): void {
    this.selectedGoal = goal;
    this.modalType = type;
    this.modalAmount = 0;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedGoal = null;
    this.modalAmount = 0;
  }

  confirmModal(): void {
    if (!this.selectedGoal || !this.modalAmount) return;
    if (this.modalType === 'deposit') {
      this.deposit(this.selectedGoal.savingGoalId, this.modalAmount);
    } else {
      this.withdraw(this.selectedGoal.savingGoalId, this.modalAmount);
    }
    this.closeModal();
  }
}
