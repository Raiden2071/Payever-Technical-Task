import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Appointment } from '../../../../core/models/appointment.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CALENDAR_CONSTANTS } from '../../../../core/models/constants/calendar.constants';

@Component({
  selector: 'app-appointment-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ],
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentCardComponent {
  appointment = input.required<Appointment>();
  edit = output<string>();
  delete = output<string>();

  readonly CALENDAR_CONSTANTS = CALENDAR_CONSTANTS;

  onEdit(): void {
    this.edit.emit(this.appointment().id);
  }

  onDelete(): void {
    this.delete.emit(this.appointment().id);
  }
} 