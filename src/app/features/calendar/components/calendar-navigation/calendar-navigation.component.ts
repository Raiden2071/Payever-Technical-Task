import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CalendarDateService } from '../../services/calendar-date.service';
import { CalendarViewMode } from '../../../../core/models/enums/calendar.enum';

@Component({
  selector: 'app-calendar-navigation',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './calendar-navigation.component.html',
  styleUrls: ['./calendar-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarNavigationComponent implements OnInit {
  private calendarDateService = inject(CalendarDateService);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  readonly CalendarViewMode = CalendarViewMode;
  readonly viewMode$ = this.calendarDateService.viewMode$;

  viewModeControl = this.formBuilder.control<CalendarViewMode | null>(null);

  ngOnInit(): void {
    this.initViewModeBindings();
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

  private initViewModeBindings(): void {
    this.viewMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: CalendarViewMode | null) => {
        this.viewModeControl.setValue(mode, { emitEvent: false });
      });

    this.viewModeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: CalendarViewMode | null) => {
        if (mode !== null) {
          this.calendarDateService.setViewMode(mode);
        }
      });
  }
}
