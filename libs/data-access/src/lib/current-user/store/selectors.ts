import { currentUserFeature } from './reducer';

export const selectCurrentUserMe = currentUserFeature.selectMe;
export const selectCurrentUserLoading = currentUserFeature.selectLoading;
export const selectCurrentUserError = currentUserFeature.selectError;
