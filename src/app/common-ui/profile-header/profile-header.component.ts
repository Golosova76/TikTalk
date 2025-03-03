import {Component, Input, input} from '@angular/core';
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";
import {Profile} from "../../data/interfaces/profile.interface";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    ImgUrlPipe,
    NgClass
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<Profile>()
  @Input() layoutClass = '';
}
