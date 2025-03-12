import { Injectable } from '@angular/core';
import { CalendarViewMode } from '../../../core/models/enums/calendar.enum';
import { Appointment } from '../../../core/models/appointment.model';
import { CALENDAR_CONSTANTS } from '../../../core/models/constants/calendar.constants';

@Injectable()
export class CalendarService {

  generateDates(viewMode: CalendarViewMode, baseDate: Date = new Date()): Date[] {
    if (viewMode === CalendarViewMode.WEEK) {
      return this.generateWeekDates(baseDate);
    } else {
      return this.generateMonthDates(baseDate);
    }
  }

  getDropListId(date: Date): string {
    return `date-${date.getTime()}`;
  }

  getAppointmentsForDate(appointments: Appointment[], date: Date): Appointment[] {
    return appointments.filter(appointment => 
      this.isSameDay(new Date(appointment.date), date)
    );
  }

  private generateWeekDates(baseDate: Date): Date[] {
    const dates = [];
    const startOfWeek = new Date(baseDate);
    
    // Adjust to start of the week (Sunday)
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    
    for (let i = 0; i < CALENDAR_CONSTANTS.DAYS_IN_WEEK; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }

  private generateMonthDates(baseDate: Date): Date[] {
    const dates = [];
    const currentMonth = baseDate.getMonth();
    const currentYear = baseDate.getFullYear();
    
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

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

}
