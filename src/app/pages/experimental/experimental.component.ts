import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Address, DeliveryMethod, ExtraServices, Product, ReceiverType } from '../../data/form.model';
import { MockService } from './mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlErrorComponent } from './control-error/control-error.component';

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
  imports: [ReactiveFormsModule, ControlErrorComponent],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
})
export class ExperimentalComponent {
  private readonly mockService = inject(MockService);
  readonly ReceiverType = ReceiverType;
  extraServices: ExtraServices[] = [];
  products: Product[] = [];

  orderForm = new FormGroup(
    {
      product: new FormControl<Product | null>(null, { validators: [Validators.required] }),
      amount: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      recipientType: new FormControl<ReceiverType>(ReceiverType.PERSON, { nonNullable: true }),
      firstName: new FormControl<string>('', { nonNullable: true }),
      lastName: new FormControl<string>('', { nonNullable: true }),
      legalName: new FormControl<string>('', { nonNullable: true }),
      inn: new FormControl<string>('', { nonNullable: true }),
      phone: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^\+?[0-9\s()-]{10,20}$/)],
      }),
      deliveryMethod: new FormControl<DeliveryMethod | ''>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      //addresses: new FormArray([getAddressForm()]), сразу создается форма с пустым адресом
      addresses: new FormArray<ReturnType<typeof getAddressForm>>([]),
      extraServices: new FormRecord<FormControl<boolean>>({}),
    },
    { validators: [this.amountInStockValidator()] }
  );

  protected get extraServicesControls(): FormRecord<FormControl<boolean>> {
    return this.orderForm.controls.extraServices;
  }

  protected get selectedProduct(): Product | null {
    return this.orderForm.controls.product.value;
  }

  protected get isPersonRecipient(): boolean {
    return this.orderForm.controls.recipientType.value === ReceiverType.PERSON;
  }

  protected get isLegalRecipient(): boolean {
    return this.orderForm.controls.recipientType.value === ReceiverType.LEGAL;
  }

  protected get isCourierDelivery(): boolean {
    return this.orderForm.controls.deliveryMethod.value === 'courier';
  }

  constructor() {
    this.updateRecipientValidators(this.orderForm.controls.recipientType.value);

    this.orderForm.controls.recipientType.valueChanges.pipe(takeUntilDestroyed()).subscribe((recipientType) => {
      this.updateRecipientValidators(recipientType);
    });

    this.orderForm.controls.deliveryMethod.valueChanges.pipe(takeUntilDestroyed()).subscribe((deliveryMethod) => {
      this.updateAddressControls(deliveryMethod);
    });

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

  private amountInStockValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup<{
        product: FormControl<Product | null>;
        amount: FormControl<number>;
      }>;

      const product = form.controls.product.value;
      const amount = form.controls.amount.value;

      if (product === null) {
        return null;
      }

      return amount > product.stock ? { amountTooLarge: true } : null;
    };
  }

  private updateRecipientValidators(recipientType: ReceiverType): void {
    const { firstName, lastName, legalName, inn } = this.orderForm.controls;

    firstName.clearValidators();
    lastName.clearValidators();
    legalName.clearValidators();
    inn.clearValidators();

    if (recipientType === ReceiverType.PERSON) {
      firstName.setValidators([Validators.required]);
      lastName.setValidators([Validators.required]);
    }

    if (recipientType === ReceiverType.LEGAL) {
      legalName.setValidators([Validators.required]);
      inn.setValidators([Validators.required, Validators.pattern(/^(\d{10}|\d{12})$/)]);
    }

    firstName.updateValueAndValidity();
    lastName.updateValueAndValidity();
    legalName.updateValueAndValidity();
    inn.updateValueAndValidity();
  }

  private updateAddressControls(deliveryMethod: DeliveryMethod | ''): void {
    const addresses = this.orderForm.controls.addresses;

    if (deliveryMethod === 'courier' && addresses.length === 0) {
      addresses.push(getAddressForm());
    }

    for (const addressGroup of addresses.controls) {
      const { city, street, house } = addressGroup.controls;
      city.clearValidators();
      street.clearValidators();
      house.clearValidators();
      if (deliveryMethod === 'courier') {
        city.setValidators([Validators.required]);
        street.setValidators([Validators.required]);
        house.setValidators([Validators.required]);
      }
      city.updateValueAndValidity();
      street.updateValueAndValidity();
      house.updateValueAndValidity();
    }
  }

  addAddress(): void {
    this.orderForm.controls.addresses.push(getAddressForm());
    this.updateAddressControls(this.orderForm.controls.deliveryMethod.value);
  }

  removeAddress(index: number): void {
    const addresses = this.orderForm.controls.addresses;
    if (addresses.length <= 1) {
      return;
    }
    addresses.removeAt(index);
  }

  onSubmit(): void {
    this.orderForm.markAllAsTouched();
    this.orderForm.updateValueAndValidity();

    console.log('[orderForm valid]', this.orderForm.valid);
    console.log('[orderForm group errors]', this.orderForm.errors);

    console.log('[firstName errors]', this.orderForm.controls.firstName.errors);
    console.log('[lastName errors]', this.orderForm.controls.lastName.errors);
    console.log('[legalName errors]', this.orderForm.controls.legalName.errors);
    console.log('[inn errors]', this.orderForm.controls.inn.errors);
    console.log('[phone errors]', this.orderForm.controls.phone.errors);

    console.log('[orderForm value]', this.orderForm.getRawValue());

    this.orderForm.controls.addresses.controls.forEach((addressGroup, index) => {
      console.log(`[address ${index} city errors]`, addressGroup.controls.city.errors);
      console.log(`[address ${index} street errors]`, addressGroup.controls.street.errors);
      console.log(`[address ${index} house errors]`, addressGroup.controls.house.errors);
    });

    if (this.orderForm.invalid) {
      return;
    }

    const formValue = this.orderForm.getRawValue();

    console.log('[submit payload]', formValue);
  }
}
