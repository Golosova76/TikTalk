import { Pipe, PipeTransform } from '@angular/core';
import { PostComment } from '../../data/interfaces/post.interface';

@Pipe({
  name: 'sortComments',
  standalone: true
})
export class SortCommentsPipe implements PipeTransform {

  transform(comments: PostComment[]): PostComment[] {
    return [...comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

}
