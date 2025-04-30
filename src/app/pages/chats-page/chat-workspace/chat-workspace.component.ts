import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ChatsService} from "../../../data/services/chats.service";
import {switchMap} from "rxjs";
import {ChatWorkspaceWrapperComponent} from "./chat-workspace-wrapper/chat-workspace-wrapper.component";
import {ChatWorkspaceHeaderComponent} from "./chat-workspace-header/chat-workspace-header.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceWrapperComponent,
    ChatWorkspaceHeaderComponent,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  chatsService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({id}) => this.chatsService.getChatById(id))
  )
}
