import { BASE_API_URL } from './constants';

export const API_LOGIN = `${BASE_API_URL}/users/token`;
export const API_GOOGLE_SSO = `${BASE_API_URL}/users/google-login`;
// 필요한 경우, 다른 API 엔드포인트도 여기에 추가 