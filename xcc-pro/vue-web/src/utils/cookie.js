import Cookies from 'js-cookie'

const TokenKey = 'tgpt_token'
const authKey = 'tgpt_menu'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAuth() {
  let menu = sessionStorage.getItem(authKey)
  if(menu){
    return JSON.parse(sessionStorage.getItem(authKey))
  }
  return [];
}
export function setAuth(menu) {
  return sessionStorage.setItem(authKey, JSON.stringify(menu))
}
export function removeAuth() {
  return sessionStorage.removeItem(authKey)
}

