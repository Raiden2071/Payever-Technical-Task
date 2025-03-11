import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent)
      },
      { path: '', redirectTo: '/calendar', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/calendar' }
];
