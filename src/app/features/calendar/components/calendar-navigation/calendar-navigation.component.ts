import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CalendarDateService } from '../../services/calendar-date.service';
import { CalendarViewMode } from '../../../../core/models/enums/calendar.enum';

@Component({
  selector: 'app-calendar-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './calendar-navigation.component.html',
  styleUrls: ['./calendar-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarNavigationComponent {
  private calendarDateService = inject(CalendarDateService);
  
  readonly CalendarViewMode = CalendarViewMode;
  
  get viewMode() {
    return this.calendarDateService.viewMode();
  }
  
  set viewMode(mode: CalendarViewMode) {
    this.calendarDateService.setViewMode(mode);
  }
  
  navigateToToday(): void {
    this.calendarDateService.navigateToToday();
  }
  
  navigateToPrevious(): void {
    this.calendarDateService.navigateToPrevious();
  }
  
  navigateToNext(): void {
    this.calendarDateService.navigateToNext();
  }
} 