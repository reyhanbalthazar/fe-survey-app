import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent {
  readonly email: string;
  readonly voucher: string;

  constructor(private readonly route: ActivatedRoute) {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.voucher = this.route.snapshot.queryParamMap.get('voucher') ?? '';
  }
}
