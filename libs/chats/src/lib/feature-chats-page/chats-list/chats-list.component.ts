import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ChatsService } from '../../data/services/chats.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@tt/common-ui';
import { LastMessageRes } from '@tt/interfaces/chats';

@Component({
  selector: 'tt-chats-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  private chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('');

  chats$ = toObservable(this.chatsService.chatsLastMessage).pipe(
    switchMap((chats) =>
      this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => this.filterChats(chats, inputValue ?? ''))
      )
    )
  );

  private filterChats(chats: LastMessageRes[], input: string): LastMessageRes[] {
    const search = input.toLowerCase();
    return chats.filter((chat) => {
      const fullName = `${chat.userFrom.lastName} ${chat.userFrom.firstName}`.toLowerCase();
      return fullName.includes(search);
    });
  }
}
