import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import {BASE_API_URL, Pageble} from "@tt/shared";
import { Profile } from "..";

type ProfileFilterParams = Partial<{
  firstName: string;
  lastName: string;
  stack: string;
}>;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  getTestAccounts() {
    return this.http.get<Profile[]>(`${BASE_API_URL}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${BASE_API_URL}account/me`).pipe(tap((res) => this.me.set(res)));
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${BASE_API_URL}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  getSubscribersIds() {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/subscribers/`)
      .pipe(map((res) => new Set(res.items.map((profile) => profile.id))));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http
      .patch<Profile>(`${BASE_API_URL}account/me`, profile)
      .pipe(tap((updatedProfile) => this.me.set(updatedProfile)));
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post<Profile>(`${BASE_API_URL}account/upload_image`, fd);
  }

  filterProfiles(params: ProfileFilterParams) {
    return this.http
      .get<Pageble<Profile>>(`${BASE_API_URL}account/accounts`, {
        params,
      })
      .pipe(tap((res) => this.filteredProfiles.set(res.items)));
  }
}
