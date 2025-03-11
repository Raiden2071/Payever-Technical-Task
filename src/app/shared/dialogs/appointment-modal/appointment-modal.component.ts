import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from '../../../core/models/appointment.model';
import { inject } from '@angular/core';

export enum AppointmentDialogType {
  NEW = 'New Appointment',
  EDIT = 'Edit Appointment'
}

export interface AppointmentDialogData {
  appointment?: Appointment;
  date?: Date;
}

@Component({
  selector: 'app-appointment-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class AppointmentModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AppointmentModalComponent>);
  private data = inject(MAT_DIALOG_DATA) as AppointmentDialogData;

  appointmentForm!: FormGroup;
  dialogTitle!: string;

  ngOnInit(): void {
    this.dialogTitle = this.data.appointment ? AppointmentDialogType.EDIT : AppointmentDialogType.NEW;
    
    this.appointmentForm = this.fb.group({
      id: [this.data.appointment?.id || Date.now().toString()],
      title: [this.data.appointment?.title || '', Validators.required],
      description: [this.data.appointment?.description || ''],
      date: [this.data.appointment?.date || this.data.date || new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 