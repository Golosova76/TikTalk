import { Component, inject, OnInit } from '@angular/core';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {chatsActions} from '@tt/data-access';

@Component({
  selector: 'tt-chats-page',
  imports: [ChatsListComponent, RouterOutlet],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export class ChatsPageComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit() {
    this.store.dispatch(chatsActions.loadMyChats());
  }
}
