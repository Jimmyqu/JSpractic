import {CanDeactivate} from '@angular/router'
import {NotFoundViewComponent} from "../not-found-view/not-found-view.component";

// CanDeactivate 需要一个泛型 当前离开的组件
export class UnsaveGuard implements CanDeactivate<NotFoundViewComponent> {
  canDeactivate(component:NotFoundViewComponent){
    return window.confirm('未保存，确定离开？')
  }
}
