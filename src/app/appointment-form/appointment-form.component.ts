import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  appointmentId?: string;

  appointmentForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: [new Date(), Validators.required]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.appointmentId = params['id'];
        const appointment = this.appointmentService.appointments().find(a => a.id === this.appointmentId);
        if (appointment) {
          this.appointmentForm.patchValue({
            title: appointment.title,
            description: appointment.description,
            date: new Date(appointment.date)
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const appointment: Appointment = {
        id: this.appointmentId || Date.now().toString(),
        title: formValue.title,
        description: formValue.description,
        date: formValue.date
      };
      
      if (this.appointmentId) {
        this.appointmentService.updateAppointment(appointment);
      } else {
        this.appointmentService.addAppointment(appointment);
      }
      
      this.router.navigate(['/calendar']);
    }
  }
} 