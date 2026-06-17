import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {Store} from "@ngrx/store";
import {chatsActions} from "@tt/data-access";

@Component({
  selector: 'tt-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(chatsActions.wsConnect());
  }

  ngOnDestroy(): void {
    this.store.dispatch(chatsActions.wsDisconnect());
  }
}
