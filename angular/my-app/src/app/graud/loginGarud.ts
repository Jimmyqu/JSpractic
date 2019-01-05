import {CanActivate} from '@angular/router'

export class LoginGarud implements CanActivate {
  canActivate(){
    let loggedIn: boolean =Math.random()>0.5;
    if (!loggedIn){
      window.alert('用户未登录')
      return false
    }
    return true
  }
}
