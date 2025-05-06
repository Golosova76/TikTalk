import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {ChatsBtnComponent} from "../chats-btn/chats-btn.component";
import {ChatsService} from "../../../data/services/chats.service";
import {AsyncPipe} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {map, startWith, switchMap} from "rxjs";
import {LastMessageRes} from "../../../data/interfaces/chats.interface";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgIconComponent,
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent implements OnInit {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('');

  ngOnInit() {
    this.chatsService.getMyChats().subscribe();
  }


  chats$ = toObservable(this.chatsService.chatsLastMessage).pipe(
    switchMap(chats => this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        map(inputValue => this.filterChats(chats, inputValue ?? ''))
        ))
    )

  private filterChats (chats: LastMessageRes[], input: string): LastMessageRes[] {
    const search = input.toLowerCase();
    return chats.filter(chat => {
      const fullName = `${chat.userFrom.lastName} ${chat.userFrom.firstName}`.toLowerCase();
      return fullName.includes(search);
    })
  }
}
