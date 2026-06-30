import { ChangeDetectionStrategy, Component, forwardRef, inject, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AddressFormValue } from '../../data/interfaces/form.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';
import { DaDataService } from '../../data/services/dadata.service';
import { AddressHint } from '../../data/interfaces/dadata-address.interface';

@Component({
  selector: 'tt-address-custom-control',
  imports: [ReactiveFormsModule],
  templateUrl: './address-custom-control.component.html',
  styleUrl: './address-custom-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressCustomControlComponent),
    },
  ],
})
export class AddressCustomControlComponent implements ControlValueAccessor {
  private readonly daDataService = inject(DaDataService);

  private onChange?: (value: AddressFormValue | null) => void;
  private onTouched?: () => void;

  private readonly searchQuery$ = new Subject<string>();

  protected readonly inputValue = signal('');
  protected readonly valueAddress = signal<AddressFormValue | null>(null);

  public readonly showRemoveButton = input<boolean>(false);
  readonly remove = output<void>();
  protected readonly hints = signal<AddressHint[]>([]);
  protected readonly isHintsOpened = signal(false);

  constructor() {
    this.searchQuery$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query) =>
          this.daDataService.getAddressSuggestion(query).pipe(
            map((hints) => ({ query, hints })),
            catchError((error: unknown) => {
              console.error('[DaData address suggestions error]', error);
              return of({ query, hints: [] });
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe(({ query, hints }) => {
        const currentQuery = this.inputValue().trim();

        if (query !== currentQuery) return;

        console.log('[AddressControl] hints loaded:', {
          query,
          count: hints.length,
        });

        this.hints.set(hints);
        this.isHintsOpened.set(query.length > 0 && hints.length > 0);
      });
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const query = value.trim();

    this.inputValue.set(value);
    this.valueAddress.set(null);
    this.onChange?.(null);

    this.hints.set([]);
    this.isHintsOpened.set(query.length > 0);

    this.searchQuery$.next(query);
  }

  writeValue(value: AddressFormValue | null): void {
    this.valueAddress.set(value);
    this.inputValue.set(value ? this.formatAddress(value) : '');
  }
  registerOnChange(fn: (value: AddressFormValue | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  // }

  protected onBlur(): void {
    this.onTouched?.();
  }

  protected formatAddress(address: AddressFormValue): string {
    return [address.city, address.street, address.house, address.building, address.apartment]
      .filter(Boolean)
      .join(', ');
  }

  selectAddress(hint: AddressHint): void {
    const address = hint.address;

    this.valueAddress.set(address);
    this.inputValue.set(hint.label);
    this.hints.set([]);
    this.isHintsOpened.set(false);

    this.onChange?.(address);
    this.onTouched?.();

    console.log('[AddressControl] sent to parent form:', address);
  }

  protected onRemove(): void {
    this.onTouched?.();
    this.remove.emit();
  }
}
