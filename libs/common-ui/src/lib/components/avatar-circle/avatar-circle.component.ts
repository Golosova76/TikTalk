import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { ImgUrlPipe } from '../../pipes';

@Component({
  selector: 'tt-avatar-circle',
  imports: [ImgUrlPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarCircleComponent {
  avatarUrl = input<string | null>();

  @Input() size: 'size32' | 'size36' | 'size112' | 'size140' = 'size140';
}
