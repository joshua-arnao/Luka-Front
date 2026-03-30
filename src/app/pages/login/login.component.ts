import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  request: LoginRequest = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.request).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Credenciales incorrectas. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}