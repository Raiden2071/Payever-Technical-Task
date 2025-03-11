import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent)
      },
      { path: '', redirectTo: '/calendar', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/calendar' }
];
