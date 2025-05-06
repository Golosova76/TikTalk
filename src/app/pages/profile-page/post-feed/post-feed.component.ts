import {AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {ProfileService} from "../../../data/services/profile.service";
import {debounceTime, firstValueFrom, fromEvent} from "rxjs";


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit, AfterViewInit {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);


  feed = this.postService.posts;

  profile = inject(ProfileService).me;

  ngOnInit() {
    this.postService.fetchPosts().subscribe();
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
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(feedElement, 'height', `${height}px`);
  }

  async onCreatePost(data: { title?: string; text: string }) {
    const user = this.profile();
    if (!user || !data.title || !data.text) return;

    await firstValueFrom(
      this.postService.createPost({
        title: data.title,
        content: data.text,
        authorId: user.id
      })
    );
  }
}
