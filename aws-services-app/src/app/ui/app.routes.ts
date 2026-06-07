import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlashcardComponent } from './components/flash-card/flashcard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'service/:id', component: FlashcardComponent },
  { path: '**', redirectTo: '' }
];
