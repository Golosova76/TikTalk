import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'tt-control-error',
  imports: [],
  templateUrl: './control-error.component.html',
  styleUrl: './control-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
  public readonly control = input.required<AbstractControl | null>();

  public readonly requiredMessage = input('Поле обязательно для заполнения');
  public readonly patternMessage = input('Неверный формат');
  public readonly minMessage = input('Количество должно быть не меньше 1');

  protected get errorMessage(): string | null {
    const control = this.control();

    if (control === null || !control.invalid || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) {
      return this.requiredMessage();
    }
    if (control.hasError('pattern')) {
      return this.patternMessage();
    }
    if (control.hasError('min')) {
      return this.minMessage();
    }
    return null;
  }
}
