import { Component } from '@angular/core';
import {ChatsListComponent} from "./chats-list/chats-list.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [
    ChatsListComponent,
    RouterOutlet
  ],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

}
