import {ChangeDetectionStrategy, Component, forwardRef, inject, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {Address, AddressFormValue} from "../../data/interfaces/form.model";

import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { MockService } from "../../experimental";

@Component({
  selector: 'tt-address-custom-control',
  imports: [
    ReactiveFormsModule
  ],
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
  private readonly mockService = inject(MockService);
  private onChange?: (value: AddressFormValue | null) => void;
  private onTouched?: () => void;

  protected readonly inputValue = signal('');
  protected readonly valueAddress = signal<AddressFormValue | null>(null);

  protected readonly suggestions = signal<AddressFormValue[]>([]);

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addresses) => {
        this.suggestions.set(addresses.map((address) => this.toAddressFormValue(address)));
      });
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

  private toAddressFormValue(address: Address): AddressFormValue {
    return {
      city: address.city ?? '',
      street: address.street ?? '',
      house: address.house ?? '',
      building: address.building ?? '',
      apartment: address.apartment ?? '',
    };
  }

  protected formatAddress(address: AddressFormValue): string {
    return [
      address.city,
      address.street,
      address.house,
      address.building,
      address.apartment,
    ]
      .filter(Boolean)
      .join(', ');
  }

  selectAddress(address: AddressFormValue): void {
    this.valueAddress.set(address);
    this.inputValue.set(this.formatAddress(address));

    this.onChange?.(address);
    this.onTouched?.();
  }
}
