import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { Address, ExtraServices, ReceiverType } from '../../data/form.model';
import { MockService } from './mock.service';

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
export class ExperimentalComponent implements OnInit {
  private readonly mockService = inject(MockService);
  extraServices: ExtraServices[] = [];

  orderForm = new FormGroup({
    product: new FormControl<string>('', { nonNullable: true }),
    amount: new FormControl<number>(0, { nonNullable: true }),
    recipientType: new FormControl<ReceiverType>(ReceiverType.PERSON, { nonNullable: true }),
    firstName: new FormControl<string>('', { nonNullable: true }),
    lastName: new FormControl<string>('', { nonNullable: true }),
    legalName: new FormControl<string>('', { nonNullable: true }),
    inn: new FormControl<string>('', { nonNullable: true }),
    deliveryMethod: new FormControl<string>('', { nonNullable: true }),
    addresses: new FormArray([getAddressForm()]),
    extraServices: new FormRecord<FormControl<boolean>>({}),
  });

  get extraServicesControls(): FormRecord<FormControl<boolean>> {
    return this.orderForm.controls.extraServices;
  }

  ngOnInit() {
    this.loadExtraServices();
  }

  private loadExtraServices(): void {
    this.mockService.getExtraServices().subscribe((extraServices) => {
      this.extraServices = extraServices;
      this.initExtraServicesControls(extraServices);
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
}
