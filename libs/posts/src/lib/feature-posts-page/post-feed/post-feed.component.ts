import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import {GlobalStoreService, postsActions, PostService, selectPosts} from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tt-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements OnInit, AfterViewInit {
  private readonly postService = inject(PostService);
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);
  private readonly store = inject(Store);

  posts = this.store.selectSignal(selectPosts);

  profile = inject(GlobalStoreService).me;

  ngOnInit() {
    this.store.dispatch(postsActions.loadPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    const feedElement = this.hostElement.nativeElement.querySelector('.scrollable-feed');
    if (!feedElement) return;

    const { top } = feedElement.getBoundingClientRect();
    const height = window.innerHeight - top - 94;
    this.r2.setStyle(feedElement, 'height', `${height}px`);
  }

  async onCreatePost(data: { title?: string; text: string }) {
    const user = this.profile();
    if (!user || !data.title || !data.text) return;

    await firstValueFrom(
      this.postService.createPost({
        title: data.title,
        content: data.text,
        authorId: user.id,
      })
    );
  }
}
