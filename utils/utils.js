import { getCookies } from "next-client-cookies/server";

export function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function logout() {
  getCookies().remove('jwt');
  getCookies().remove('user');
  redirect('/login');
}