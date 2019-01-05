import {Injectable} from '@angular/core'
import {HomeViewComponent} from "../home-view/home-view.component";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,Router} from '@angular/router'

@Injectable()
export class HomeResolve implements Resolve<HomeViewComponent>{
  constructor(private  router:Router){
  }
  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    let id:number = route.params['id']
    if(id == 1){
      console.log('this id is 1')

    }else {
      this.router.navigate(['/home'])
    }

    return undefined
  }

}
