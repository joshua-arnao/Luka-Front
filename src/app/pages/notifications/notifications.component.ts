import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationResponse } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationResponse[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId() || '';
    this.notificationService.getNotifications(userId).subscribe({
      next: (notifs) => {
        this.notifications = notifs;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  markAsRead(notification: NotificationResponse): void {
    if (notification.read) return;
    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => (notification.read = true),
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      MONEY_SENT: '↑',
      MONEY_RECEIVED: '↓',
      SAVINGS_GOAL_REACHED: '★',
      PERCENTAGE_SAVING_SUCCESS: '✓',
      PERCENTAGE_SAVING_FAILED: '✗',
      SCHEDULED_SAVING_SUCCESS: '✓',
      SCHEDULED_SAVING_FAILED: '✗',
      ROUNDUP_SAVING_SUCCESS: '✓',
      ROUNDUP_SAVING_FAILED: '✗',
    };
    return icons[type] || '•';
  }

  getIconClass(type: string): string {
    if (type.includes('FAILED')) return 'red';
    if (type === 'MONEY_SENT') return 'purple';
    if (type === 'MONEY_RECEIVED') return 'green';
    return 'yellow';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
