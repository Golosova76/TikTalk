import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { MockService } from './mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlErrorComponent } from '../control-error';
import { DeliveryMethod, ExtraServices, Product, ReceiverType } from '../data';
import { AddressCustomControlComponent } from '../ui';
import { AddressFormValue } from '../data/interfaces/form.model';

function getAddressControl(initialValue: AddressFormValue | null = null) {
  return new FormControl<AddressFormValue | null>(initialValue, { validators: [requiredAddress] });
}

function requiredAddress(control: AbstractControl<AddressFormValue | null>): ValidationErrors | null {
  const address = control.value;

  if (address === null) {
    return { required: true };
  }

  const city = address.city.trim();
  const street = address.street.trim();
  const house = address.house.trim();

  if (!city || !street || !house) {
    return { required: true };
  }

  return null;
}

@Component({
  selector: 'tt-experimental',
  imports: [ReactiveFormsModule, ControlErrorComponent, AddressCustomControlComponent],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      //addresses: new FormArray<ReturnType<typeof getAddressForm>>([]),
      addresses: new FormArray<ReturnType<typeof getAddressControl>>([]),
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
      addresses.push(getAddressControl());
    }

    if (deliveryMethod !== 'courier') {
      addresses.clear();
    }
  }

  addAddress(): void {
    this.orderForm.controls.addresses.push(getAddressControl());
  }

  removeAddress(index: number): void {
    const addresses = this.orderForm.controls.addresses;
    if (addresses.length <= 1) {
      return;
    }
    addresses.removeAt(index);
  }

  onReset() {
    this.orderForm.reset();

    this.orderForm.controls.addresses.clear();

    for (const extraService of this.extraServices) {
      const control = this.orderForm.controls.extraServices.controls[extraService.code];

      if (control) {
        control.reset(extraService.value);
      }
    }

    this.updateRecipientValidators(ReceiverType.PERSON);
    this.updateAddressControls('');
  }

  onSubmit(): void {
    this.orderForm.markAllAsTouched();
    this.orderForm.updateValueAndValidity();

    if (this.orderForm.invalid) {
      return;
    }

    const formValue = this.orderForm.getRawValue();

    const payload = {
      productId: formValue.product?.id,
      amount: formValue.amount,

      recipientType: formValue.recipientType,
      recipient:
        formValue.recipientType === ReceiverType.PERSON
          ? {
              firstName: formValue.firstName,
              lastName: formValue.lastName,
            }
          : {
              legalName: formValue.legalName,
              inn: formValue.inn,
            },

      phone: formValue.phone,
      deliveryMethod: formValue.deliveryMethod,

      addresses: formValue.deliveryMethod === 'courier' ? formValue.addresses : [],

      extraServices: formValue.extraServices,
    };

    console.log('[getRawValue]', formValue);
    console.log('[submit payload]', payload);
  }
}
