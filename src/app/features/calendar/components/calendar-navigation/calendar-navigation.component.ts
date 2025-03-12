import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CalendarStateService } from '../../services/calendar-state.service';
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
  private calendarState = inject(CalendarStateService);
  
  readonly CalendarViewMode = CalendarViewMode;
  
  get viewMode(): CalendarViewMode {
    return this.calendarState.viewMode;
  }
  
  set viewMode(mode: CalendarViewMode) {
    this.calendarState.setViewMode(mode);
  }
  
  navigateToToday(): void {
    this.calendarState.navigateToToday();
  }
  
  navigateToPrevious(): void {
    this.calendarState.navigateToPrevious();
  }
  
  navigateToNext(): void {
    this.calendarState.navigateToNext();
  }
} 