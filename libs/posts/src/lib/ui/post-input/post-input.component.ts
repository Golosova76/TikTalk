import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { selectCurrentUserMe } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-post-input',
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostInputComponent {
  private readonly r2 = inject(Renderer2);
  private readonly store = inject(Store);

  readonly profile = this.store.selectSignal(selectCurrentUserMe);

  @Input() showTitle = false;
  @Input() placeholder = 'Напишите что-нибудь...';
  @Output() created = new EventEmitter<{ title?: string; text: string }>();

  @Input() borderStyle: 'solid' | 'dashed' = 'solid';

  @HostBinding('style.borderStyle')
  get hostBorderStyle() {
    return this.borderStyle;
  }

  title = '';
  text = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSubmit(): void {
    if (!this.text) return;

    /*
    this.submit.emit({
      ...(this.showTitle ? { title: this.title } : {}),
      text: this.text
    });
    */

    if (this.showTitle) {
      this.created.emit({ title: this.title, text: this.text });
    } else {
      this.created.emit({ text: this.text });
    }

    // Очищаем поля после отправки
    this.title = '';
    this.text = '';
  }
}
