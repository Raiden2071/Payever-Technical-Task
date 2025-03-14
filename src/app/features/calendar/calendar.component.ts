import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';
import { DialogService } from '../../core/services/dialog.service';
import { AppointmentCardComponent } from './components/appointment-card/appointment-card.component';
import { CalendarService } from './services/calendar.service';
import { CalendarViewMode } from '../../core/models/enums/calendar.enum';
import { CALENDAR_CONSTANTS } from '../../core/models/constants/calendar.constants';
import { CalendarDateService } from './services/calendar-date.service';
import { CalendarNavigationComponent } from './components/calendar-navigation/calendar-navigation.component';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule, 
    DragDropModule, 
    MatCardModule, 
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    AppointmentCardComponent,
    CalendarNavigationComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalendarService, CalendarDateService],
})
export class CalendarComponent implements OnInit {
  appointmentService = inject(AppointmentService);
  calendarService = inject(CalendarService);
  dialogService = inject(DialogService);
  calendarDateService = inject(CalendarDateService);
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);

  readonly CalendarViewMode = CalendarViewMode;
  readonly CALENDAR_CONSTANTS = CALENDAR_CONSTANTS;
  
  viewMode: CalendarViewMode = CALENDAR_CONSTANTS.DEFAULT_VIEW_MODE;
  appointments: Appointment[] = [];
  dates: Date[] = [];
  connectedLists: string[] = [];
  hoveredDate: Date | null = null;

  ngOnInit(): void {
    combineLatest([
      this.calendarDateService.viewMode$,
      this.appointmentService.appointments$,
      this.calendarDateService.dates$,
      this.calendarDateService.connectedLists$
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([viewMode, appointments, dates, connectedLists]) => {
      console.log('combineLatest');
      this.viewMode = viewMode;
      this.appointments = appointments;
      this.dates = dates;
      this.connectedLists = connectedLists;
      
      this.cdr.markForCheck();
    });
  }

  getDropListId(date: Date): string {
    return this.calendarService.getDropListId(date);
  }

  getAppointmentsForDate(date: Date, appointments: Appointment[]): Appointment[] {
    return this.calendarService.getAppointmentsForDate(appointments, date);
  }

  drop(event: CdkDragDrop<Appointment[]>, targetDate: Date) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const movedAppointment = event.container.data[event.currentIndex];
      const newDate = new Date(movedAppointment.date);
      
      newDate.setFullYear(targetDate.getFullYear());
      newDate.setMonth(targetDate.getMonth());
      newDate.setDate(targetDate.getDate());
      
      const updatedAppointment: Appointment = {
        ...movedAppointment,
        date: newDate
      };
      
      this.appointmentService.updateAppointment(updatedAppointment);
    }
  }

  setHoveredDate(date: Date | null): void {
    this.hoveredDate = date;
  }

  editAppointment(id: string, appointments: Appointment[]): void {
    const appointment = appointments.find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openAppointmentDialog(appointment);
    }
  }

  deleteAppointment(id: string, appointments: Appointment[]): void {
    const appointment = appointments.find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openDeleteConfirmDialog(appointment);
    }
  }
}
