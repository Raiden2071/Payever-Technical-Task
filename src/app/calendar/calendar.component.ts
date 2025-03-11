import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppointmentModalComponent, AppointmentDialogData } from '../appointment-modal/appointment-modal.component';
import { ConfirmDeleteModalComponent, ConfirmDeleteDialogData } from '../confirm-delete-modal/confirm-delete-modal.component';

export type CalendarViewMode = 'week' | 'month';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    DragDropModule, 
    MatCardModule, 
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  viewMode: CalendarViewMode = 'week';
  dates: Date[] = [];
  appointments = this.appointmentService.appointments;
  connectedLists: string[] = [];
  hoveredDate: Date | null = null;

  ngOnInit(): void {
    this.dates = this.generateDates();
    this.updateConnectedLists();
  }

  generateDates(): Date[] {
    if (this.viewMode === 'week') {
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
    this.connectedLists = this.dates.map(date => `date-${date.getTime()}`);
  }

  getDropListId(date: Date): string {
    return `date-${date.getTime()}`;
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments().filter(a => this.isSameDay(new Date(a.date), date));
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

  openAppointmentDialog(appointment?: Appointment, date?: Date): void {
    const dialogData: AppointmentDialogData = {
      appointment,
      date: date || new Date()
    };

    const dialogRef = this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        if (result) {
          if (appointment) {
            this.appointmentService.updateAppointment(result);
          } else {
            this.appointmentService.addAppointment(result);
          }
        }
      });
  }

  openDeleteConfirmDialog(appointment: Appointment): void {
    const dialogData: ConfirmDeleteDialogData = {
      appointment
    };

    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        if (result) {
          this.appointmentService.removeAppointment(appointment.id);
        }
      });
  }

  editAppointment(id: string): void {
    const appointment = this.appointments().find(a => a.id === id);
    if (appointment) {
      this.openAppointmentDialog(appointment);
    }
  }

  deleteAppointment(id: string): void {
    const appointment = this.appointments().find(a => a.id === id);
    if (appointment) {
      this.openDeleteConfirmDialog(appointment);
    }
  }
} 