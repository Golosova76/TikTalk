import {Component, input, Input} from '@angular/core';
import {Post} from "../../../data/interfaces/post.interface";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  post = input<Post>();
}
