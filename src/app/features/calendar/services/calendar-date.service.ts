import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarViewMode } from '../../../core/models/enums/calendar.enum';
import { CALENDAR_CONSTANTS } from '../../../core/models/constants/calendar.constants';
import { CalendarService } from './calendar.service';

@Injectable()
export class CalendarDateService {
  private calendarService = inject(CalendarService);
  
  private currentDateSubject$ = new BehaviorSubject<Date>(new Date());
  private viewModeSubject$ = new BehaviorSubject<CalendarViewMode>(CALENDAR_CONSTANTS.DEFAULT_VIEW_MODE);
  private datesSubject$ = new BehaviorSubject<Date[]>([]);
  private connectedListsSubject$ = new BehaviorSubject<string[]>([]);

  readonly dates$: Observable<Date[]> = this.datesSubject$.asObservable();
  readonly connectedLists$: Observable<string[]> = this.connectedListsSubject$.asObservable();
  readonly viewMode$: Observable<CalendarViewMode> = this.viewModeSubject$.asObservable();

  constructor() {
    this.updateDates();
  }

  setViewMode(viewMode: CalendarViewMode): void {
    this.viewModeSubject$.next(viewMode);
    this.updateDates();
  }

  navigateToToday(): void {
    this.currentDateSubject$.next(new Date());
    this.updateDates();
  }

  navigateToPrevious(): void {
    const currentDate = this.currentDateSubject$.getValue();
    const newDate = new Date(currentDate);
    
    if (this.viewModeSubject$.getValue() === CalendarViewMode.WEEK) {
      // Move back one week
      newDate.setDate(currentDate.getDate() - CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      // Move back one month
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    
    this.currentDateSubject$.next(newDate);
    this.updateDates();
  }

  navigateToNext(): void {
    const currentDate = this.currentDateSubject$.getValue();
    const newDate = new Date(currentDate);
    
    if (this.viewModeSubject$.getValue() === CalendarViewMode.WEEK) {
      newDate.setDate(currentDate.getDate() + CALENDAR_CONSTANTS.DAYS_IN_WEEK);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    
    this.currentDateSubject$.next(newDate);
    this.updateDates();
  }

  private updateDates(): void {
    const dates = this.calendarService.generateDates(
      this.viewModeSubject$.getValue(), 
      this.currentDateSubject$.getValue()
    );
    this.datesSubject$.next(dates);
    this.updateConnectedLists();
  }

  private updateConnectedLists(): void {
    const dates = this.datesSubject$.getValue();
    const connectedLists = dates.map((date: Date) => this.calendarService.getDropListId(date));
    this.connectedListsSubject$.next(connectedLists);
  }
} 