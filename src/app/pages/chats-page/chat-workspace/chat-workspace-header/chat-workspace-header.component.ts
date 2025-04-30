import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {SvgIconComponent} from "../../../../common-ui/svg-icon/svg-icon.component";
import {Profile} from "../../../../data/interfaces/profile.interface";

@Component({
  selector: 'app-chat-workspace-header',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe,
    SvgIconComponent
  ],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss'
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>()

}
