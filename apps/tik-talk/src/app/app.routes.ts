import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { ExperimentalComponent } from '@tt/experimental';
import { LayoutComponent } from '@tt/layout';
import { provideState } from '@ngrx/store';
import { PostEffects, postsFeature, profileFeature } from '@tt/data-access';
import { provideEffects } from '@ngrx/effects';
import { ProfileEffects } from '@tt/data-access';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [provideState(postsFeature), provideEffects(PostEffects)],
      },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'experimental', component: ExperimentalComponent },
      { path: 'chats', loadChildren: () => chatsRoutes },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
