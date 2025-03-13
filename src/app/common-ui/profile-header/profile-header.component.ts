import {Component, Input, input} from '@angular/core';
import {Profile} from "../../data/interfaces/profile.interface";
import {NgClass} from "@angular/common";
import {AvatarCircleComponent} from "../avatar-circle/avatar-circle.component";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    NgClass,
    AvatarCircleComponent
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<Profile>()
  @Input() layoutClass = '';

  get avatarSize(): 'size32' | 'size36' | 'size112' | 'size140' {
    if (this.layoutClass === 'horizontal-layout') return 'size140';
    if (this.layoutClass === 'vertical-layout') return 'size112';
    return 'size36';
  }
}
