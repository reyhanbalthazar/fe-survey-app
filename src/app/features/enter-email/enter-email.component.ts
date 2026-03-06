import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SurveyService } from '../../core/services/survey.service';
import { ErrorStateService } from '../../core/services/error-state.service';
import { SurveyDetail } from '../../models/survey.model';

@Component({
  selector: 'app-enter-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enter-email.component.html',
  styleUrl: './enter-email.component.css'
})
export class EnterEmailComponent implements OnInit {
  readonly form;

  slug = '';
  surveyCode = '';
  survey: SurveyDetail | null = null;
  loading = true;
  checking = false;
  localError = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly surveyService: SurveyService,
    private readonly errorState: ErrorStateService
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.surveyCode = this.route.snapshot.paramMap.get('surveyCode') ?? '';

    this.surveyService.getSurvey(this.slug, this.surveyCode).subscribe({
      next: (response) => {
        this.survey = response.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  continueToSurvey(): void {
    this.localError = '';
    this.errorState.clear();

    if (this.form.invalid || this.checking) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.survey) {
      this.localError = 'Survey not found.';
      return;
    }

    this.checking = true;

    this.surveyService.checkEmailUnique(this.survey.id, this.form.value.email ?? '').subscribe({
      next: (response) => {
        this.checking = false;

        if (!response.success) {
          this.localError = response.message ?? 'Email has already submitted this survey.';
          return;
        }

        void this.router.navigate(['/survey', this.slug, this.surveyCode, 'form'], {
          queryParams: {
            email: this.form.value.email
          }
        });
      },
      error: () => {
        this.checking = false;
      }
    });
  }
}
