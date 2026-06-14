import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '@tt/shared';
import { Profile, ProfileFilterParams } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  getMe() {
    return this.http.get<Profile>(`${BASE_API_URL}account/me`);
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${BASE_API_URL}account/me`, profile);
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${BASE_API_URL}account/${id}`);
  }

  filterProfiles(params: ProfileFilterParams) {
    return this.http.get<Pageble<Profile>>(`${BASE_API_URL}account/accounts`, { params });
  }

  getSubscribers() {
    return this.http.get<Pageble<Profile>>(`${BASE_API_URL}account/subscribers/`);
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post<Profile>(`${BASE_API_URL}account/upload_image`, fd);
  }
}
