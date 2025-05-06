import {Component, input} from '@angular/core';
import {LastMessageRes} from "../../../data/interfaces/chats.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    DatePipe
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
}
