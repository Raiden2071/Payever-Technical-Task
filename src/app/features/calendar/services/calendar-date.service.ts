import { Injectable, inject, signal } from '@angular/core';
import { CalendarViewMode } from '../../../core/models/enums/calendar.enum';
import { CALENDAR_CONSTANTS } from '../../../core/models/constants/calendar.constants';
import { CalendarService } from './calendar.service';

@Injectable()
export class CalendarDateService {
  private calendarService = inject(CalendarService);
  
  private currentDateSignal = signal<Date>(new Date());
  private viewModeSignal = signal<CalendarViewMode>(CALENDAR_CONSTANTS.DEFAULT_VIEW_MODE);
  private datesSignal = signal<Date[]>([]);
  public connectedListsSignal = signal<string[]>([]);

  readonly dates = this.datesSignal.asReadonly();
  readonly connectedLists = this.connectedListsSignal.asReadonly();
  readonly viewMode = this.viewModeSignal.asReadonly();

  constructor() {
    this.updateDates();
  }

  setViewMode(viewMode: CalendarViewMode): void {
    this.viewModeSignal.set(viewMode);
    this.updateDates();
  }

  navigateToToday(): void {
    this.currentDateSignal.set(new Date());
    this.updateDates();
  }

  navigateToPrevious(): void {
    const currentDate = this.currentDateSignal();
    const newDate = new Date(this.currentDateSignal());
    
    if (this.viewModeSignal() === CalendarViewMode.WEEK) {
      // Move back one week
      newDate.setDate(currentDate.getDate() - CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      // Move back one month
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    
    this.currentDateSignal.set(newDate);
    this.updateDates();
  }

  navigateToNext(): void {
    const currentDate = this.currentDateSignal();
    const newDate = new Date(currentDate);
    
    if (this.viewModeSignal() === CalendarViewMode.WEEK) {
      newDate.setDate(currentDate.getDate() + CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    
    this.currentDateSignal.set(newDate);
    this.updateDates();
  }

  private updateDates(): void {
    const dates = this.calendarService.generateDates(this.viewModeSignal(), this.currentDateSignal());
    this.datesSignal.set(dates);
    this.updateConnectedLists();
  }

  private updateConnectedLists(): void {
    const connectedLists = this.dates().map((date: Date) => this.calendarService.getDropListId(date));
    this.connectedListsSignal.set(connectedLists);
  }
} 