import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Appointment } from '../../../../core/models/appointment.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
  @Input() appointment!: Appointment;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.appointment.id);
  }

  onDelete(): void {
    this.delete.emit(this.appointment.id);
  }
} 