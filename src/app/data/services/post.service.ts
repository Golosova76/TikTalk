import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http = inject(HttpClient);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';


}
