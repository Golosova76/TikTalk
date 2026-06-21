import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { SvgIconComponent } from '@tt/common-ui';
import { LastMessageRes, selectChatsLastMessage } from '@tt/data-access';
import { Store } from '@ngrx/store';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent {
  private readonly store = inject(Store);

  chatsLastMessage = this.store.select(selectChatsLastMessage);

  filterChatsControl = new FormControl('');

  chats$ = this.chatsLastMessage.pipe(
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
