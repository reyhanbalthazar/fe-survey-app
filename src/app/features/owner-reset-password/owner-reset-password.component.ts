import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { OwnerAuthService } from '../../core/services/owner-auth.service';
import { ErrorStateService } from '../../core/services/error-state.service';

@Component({
  selector: 'app-owner-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-reset-password.component.html',
  styleUrl: './owner-reset-password.component.css'
})
export class OwnerResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  loading = false;
  token = '';
  email = '';
  successMessage = '';

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: OwnerAuthService,
    private readonly errorState: ErrorStateService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';

    if (!this.token || !this.email) {
      this.errorState.setMessage('Password reset link is invalid or incomplete.');
    }
  }

  get passwordMismatch(): boolean {
    const password = this.form.controls.password.value;
    const confirmation = this.form.controls.password_confirmation.value;

    return !!password && !!confirmation && password !== confirmation;
  }

  submit(): void {
    this.errorState.clear();

    if (!this.token || !this.email) {
      this.errorState.setMessage('Password reset link is invalid or incomplete.');
      return;
    }

    if (this.passwordMismatch) {
      this.form.controls.password_confirmation.markAsTouched();
      return;
    }

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService
      .resetPassword(
        this.email,
        this.token,
        this.form.controls.password.value,
        this.form.controls.password_confirmation.value
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = response.message || 'Password reset successful.';
          void this.router.navigate(['/owner/login'], {
            queryParams: {
              reset: 'success'
            }
          });
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
