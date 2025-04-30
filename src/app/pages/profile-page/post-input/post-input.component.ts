import {Component, EventEmitter, HostBinding, inject, Input, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from "../../../data/services/profile.service";
import {NgIf} from "@angular/common";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    NgIf,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2 = inject(Renderer2);

  profile = inject(ProfileService).me;

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
