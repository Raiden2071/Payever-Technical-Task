import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarViewMode } from '../../../core/models/enums/calendar.enum';
import { CALENDAR_CONSTANTS } from '../../../core/models/constants/calendar.constants';
import { CalendarService } from './calendar.service';

@Injectable()
export class CalendarStateService {
  private calendarService = inject(CalendarService);
  
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  private viewModeSubject = new BehaviorSubject<CalendarViewMode>(CALENDAR_CONSTANTS.DEFAULT_VIEW_MODE);

  private datesSignal = signal<Date[]>([]);

  currentDate$: Observable<Date> = this.currentDateSubject.asObservable();
  viewMode$: Observable<CalendarViewMode> = this.viewModeSubject.asObservable();

  constructor() {
    this.updateDates();
  }

  get currentDate(): Date {
    return this.currentDateSubject.value;
  }

  get viewMode(): CalendarViewMode {
    return this.viewModeSubject.value;
  }

  get dates(): Date[] {
    return this.datesSignal();
  }

  setViewMode(viewMode: CalendarViewMode): void {
    this.viewModeSubject.next(viewMode);
    this.updateDates();
  }

  navigateToToday(): void {
    this.currentDateSubject.next(new Date());
    this.updateDates();
  }

  navigateToPrevious(): void {
    const currentDate = this.currentDateSubject.value;
    const newDate = new Date(currentDate);
    
    if (this.viewMode === CalendarViewMode.WEEK) {
      // Move back one week
      newDate.setDate(currentDate.getDate() - CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      // Move back one month
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    
    this.currentDateSubject.next(newDate);
    this.updateDates();
  }

  navigateToNext(): void {
    const currentDate = this.currentDateSubject.value;
    const newDate = new Date(currentDate);
    
    if (this.viewMode === CalendarViewMode.WEEK) {
      newDate.setDate(currentDate.getDate() + CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    
    this.currentDateSubject.next(newDate);
    this.updateDates();
  }

  private updateDates(): void {
    const dates = this.calendarService.generateDates(this.viewMode, this.currentDate);
    this.datesSignal.set(dates);
  }
} 