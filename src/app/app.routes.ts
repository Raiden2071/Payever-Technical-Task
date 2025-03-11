import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'appointment/new',
    loadComponent: () => import('./appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  },
  {
    path: 'appointment/:id',
    loadComponent: () => import('./appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  },
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: '**', redirectTo: '/calendar' }
];
