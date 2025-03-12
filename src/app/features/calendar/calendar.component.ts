import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
    FormsModule,
    AppointmentCardComponent,
    CalendarNavigationComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalendarService, CalendarDateService],
})
export class CalendarComponent {
  private appointmentService = inject(AppointmentService);
  private calendarService = inject(CalendarService);
  public dialogService = inject(DialogService);
  public calendarDateService = inject(CalendarDateService);

  readonly viewMode = this.calendarDateService.viewMode;
  readonly appointments = this.appointmentService.appointments;
  readonly dates = this.calendarDateService.dates;
  readonly connectedLists = this.calendarDateService.connectedLists;

  readonly CalendarViewMode = CalendarViewMode;
  readonly CALENDAR_CONSTANTS = CALENDAR_CONSTANTS;
  
  hoveredDate: Date | null = null;

  getDropListId(date: Date): string {
    return this.calendarService.getDropListId(date);
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.calendarService.getAppointmentsForDate(this.appointments(), date);
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

  editAppointment(id: string): void {
    const appointment = this.appointments().find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openAppointmentDialog(appointment);
    }
  }

  deleteAppointment(id: string): void {
    const appointment = this.appointments().find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openDeleteConfirmDialog(appointment);
    }
  }
}
