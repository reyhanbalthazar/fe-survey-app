import { Routes } from '@angular/router';
import { EnterEmailComponent } from './features/enter-email/enter-email.component';
import { InvalidLinkComponent } from './features/invalid-link/invalid-link.component';
import { SurveyComponent } from './features/survey/survey.component';
import { ThankYouComponent } from './features/thank-you/thank-you.component';

export const routes: Routes = [
  { path: 'survey/:slug/:surveyCode', component: EnterEmailComponent },
  { path: 'survey/:slug/:surveyCode/form', component: SurveyComponent },
  { path: 'survey/:slug/:surveyCode/done', component: ThankYouComponent },
  { path: '', component: InvalidLinkComponent },
  { path: '**', component: InvalidLinkComponent }
];
