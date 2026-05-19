import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address, ExtraServices, Product, ReceiverType } from '../../data/form.model';
import { MockService } from './mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? '', { nonNullable: true }),
    street: new FormControl<string>(initialValue.street ?? '', { nonNullable: true }),
    house: new FormControl<string>(initialValue.house ?? '', { nonNullable: true }),
    building: new FormControl<string>(initialValue.building ?? '', { nonNullable: true }),
    apartment: new FormControl<string>(initialValue.apartment ?? '', { nonNullable: true }),
  });
}

@Component({
  selector: 'app-experimental',
  imports: [ReactiveFormsModule],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
})
export class ExperimentalComponent {
  private readonly mockService = inject(MockService);
  extraServices: ExtraServices[] = [];
  products: Product[] = [];

  orderForm = new FormGroup({
    product: new FormControl<Product | null>(null, { validators: [Validators.required] }),
    amount: new FormControl<number>(0, { nonNullable: true }),
    recipientType: new FormControl<ReceiverType>(ReceiverType.PERSON, { nonNullable: true }),
    firstName: new FormControl<string>('', { nonNullable: true }),
    lastName: new FormControl<string>('', { nonNullable: true }),
    legalName: new FormControl<string>('', { nonNullable: true }),
    inn: new FormControl<string>('', { nonNullable: true }),
    deliveryMethod: new FormControl<string>('', { nonNullable: true }),
    //addresses: new FormArray([getAddressForm()]), сразу создается форма с пустым адресом
    addresses: new FormArray<ReturnType<typeof getAddressForm>>([]),
    extraServices: new FormRecord<FormControl<boolean>>({}),
  });

  protected get extraServicesControls(): FormRecord<FormControl<boolean>> {
    return this.orderForm.controls.extraServices;
  }

  protected get selectedProduct(): Product | null {
    return this.orderForm.controls.product.value;
  }

  protected get isAmountToLarge(): boolean {
    const product = this.selectedProduct;
    const amount = this.orderForm.controls.amount.value;

    return !!product && amount > product.stock;
  }

  constructor() {
    this.mockService
      .getExtraServices()
      .pipe(takeUntilDestroyed())
      .subscribe((extraServices) => {
        this.extraServices = extraServices;
        this.initExtraServicesControls(extraServices);
      });

    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addresses) => {
        for (const address of addresses) {
          this.orderForm.controls.addresses.push(getAddressForm(address));
        }
      });

    this.mockService
      .getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.products = products;
      });
  }

  private initExtraServicesControls(extraServices: ExtraServices[]): void {
    const features = this.orderForm.controls.extraServices;

    for (const extraService of extraServices) {
      if (features.contains(extraService.code)) {
        continue;
      }

      features.addControl(extraService.code, new FormControl<boolean>(extraService.value, { nonNullable: true }));
    }
  }

  addAddress(): void {
    this.orderForm.controls.addresses.push(getAddressForm());
  }

  removeAddress(index: number): void {
    this.orderForm.controls.addresses.removeAt(index);
  }
}
