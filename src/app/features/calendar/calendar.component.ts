import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../core/services/dialog.service';
import { AppointmentCardComponent } from './components/appointment-card/appointment-card.component';

export enum CalendarViewMode {
  WEEK = 'week',
  MONTH = 'month'
}

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
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  public dialogService = inject(DialogService);

  CalendarViewMode = CalendarViewMode;
  
  viewMode: CalendarViewMode = CalendarViewMode.WEEK;
  dates: Date[] = [];
  connectedLists: string[] = [];
  hoveredDate: Date | null = null;

  get appointments(): Appointment[] {
    return this.appointmentService.appointments();
  }

  ngOnInit(): void {
    this.dates = this.generateDates();
    this.updateConnectedLists();
  }

  generateDates(): Date[] {
    if (this.viewMode === CalendarViewMode.WEEK) {
      return this.generateWeekDates();
    } else {
      return this.generateMonthDates();
    }
  }

  generateWeekDates(): Date[] {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }

  generateMonthDates(): Date[] {
    const dates = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Generate all days in the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    
    return dates;
  }

  onViewModeChange(): void {
    this.dates = this.generateDates();
    this.updateConnectedLists();
  }

  updateConnectedLists(): void {
    this.connectedLists = this.dates.map((date: Date) => `date-${date.getTime()}`);
  }

  getDropListId(date: Date): string {
    return `date-${date.getTime()}`;
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(appointment => this.isSameDay(new Date(appointment.date), date));
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
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
    const appointment = this.appointments.find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openAppointmentDialog(appointment);
    }
  }

  deleteAppointment(id: string): void {
    const appointment = this.appointments.find(appointment => appointment.id === id);
    if (appointment) {
      this.dialogService.openDeleteConfirmDialog(appointment);
    }
  }
} 