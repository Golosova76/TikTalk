import { Pipe, PipeTransform } from '@angular/core';

interface CommentWithCreatedAt {
  createdAt: string;
}

@Pipe({
  name: 'sortComments',
  standalone: true,
})
export class SortCommentsPipe implements PipeTransform {
  //transform(comments: PostComment[]): PostComment[] {
  //  return [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  //}

  transform<T extends CommentWithCreatedAt>(comments: T[] | null | undefined): T[] {
    if (!comments?.length) {
      return [];
    }

    return [...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
