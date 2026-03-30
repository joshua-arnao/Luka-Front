import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  request: RegisterRequest = {
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phoneNumber: '',
    password: '',
  };
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.register(this.request).subscribe({
      next: () => {
        this.success = '¡Cuenta creada! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.error = 'Error al crear la cuenta. Verifica los datos.';
        this.loading = false;
      },
    });
  }
}
