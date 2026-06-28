import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { SvgIconComponent } from '@tt/common-ui';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tt-stack-custom-control',
  imports: [SvgIconComponent],
  templateUrl: './stack-custom-control.component.html',
  styleUrl: './stack-custom-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackCustomControlComponent),
    },
  ],
})
export class StackCustomControlComponent implements ControlValueAccessor {
  private onChange?: (value: string[]) => void;
  private onTouched?: () => void;

  protected readonly valueStack = signal<string[]>([]);

  protected readonly inputValue = signal('');

  protected skillAdd() {
    const skill = this.inputValue().trim();
    if (!skill) return;

    const nextStack = [...this.valueStack(), skill];

    this.updateValue(nextStack);
    this.inputValue.set('');
  }
  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inputValue.set(input.value);
  }

  protected onRemoveSkill(index: number) {
    const nextStack = this.valueStack().filter((_, currentIndex) => currentIndex !== index);
    this.updateValue(nextStack);
  }

  private updateValue(value: string[]) {
    this.valueStack.set(value);
    this.onChange?.(value);
    this.onTouched?.();
  }

  writeValue(value: string[] | null): void {
    this.valueStack.set(value ?? []);
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //     throw new Error("Method not implemented.");
  // }
}
