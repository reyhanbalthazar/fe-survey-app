import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { OwnerAuthService } from '../../core/services/owner-auth.service';
import { ErrorStateService } from '../../core/services/error-state.service';

@Component({
  selector: 'app-owner-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-forgot-password.component.html',
  styleUrl: './owner-forgot-password.component.css'
})
export class OwnerForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  successMessage = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private readonly authService: OwnerAuthService,
    private readonly errorState: ErrorStateService
  ) {}

  submit(): void {
    this.errorState.clear();
    this.successMessage = '';

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.form.controls.email.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message || 'Password reset link has been sent.';
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
