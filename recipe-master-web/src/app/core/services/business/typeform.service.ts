import { Injectable } from '@angular/core';
import { TyperformCount, PopupOpened } from '../../models/business/typeformCount';
import { User } from '../../models/user';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TypeformService {

  constructor() { }

  // isMinRecipesDone():boolean {
  //   return localStorage.getItem("minRecipesDone")=="true"?true:false;
  // }

  // setMinRecipesDone(isMinRecipesDone:boolean) {
  //   localStorage.setItem("minRecipesDone", isMinRecipesDone?"true":"false");
  // }

  getTotalRecipesDone(user: User):TyperformCount {

    let tfcs:TyperformCount[] = this.getAllTypeformCount();

    let tfc:TyperformCount = tfcs.find( tf => tf.email == user.email );

    if(_.isNil(tfc)) {
        tfc = {
            email: user.email,
            count: 0
        }
    }

    return tfc;

  }

  isPopupOpened(user: User):boolean {

    let tpos:PopupOpened[] = this.getAllPopupOpened();

    let po:PopupOpened = tpos.find( tf => tf.email == user.email );

    return !_.isNil(po);

  }

  setTotalRecipesDone(tfc:TyperformCount) {

    let tfcs:TyperformCount[] = this.getAllTypeformCount();

    try {
        tfcs.find( tf => tf.email == tfc.email ).count = tfc.count;
    }
    catch(e) {
        tfcs.push(tfc);
    }

    localStorage.setItem("totalRecipesDone", JSON.stringify(tfcs));

  }

  setPopupOpened(tpo: PopupOpened) {

    let tpos:PopupOpened[] = this.getAllPopupOpened();

    try {

      if( _.isNil(tpos.find( tf => tf.email == tpo.email )) ) {
        tpos.push(tpo);
      }

    }
    catch(e) {
      console.warn(e.message);
    }

    localStorage.setItem("popupOpened", JSON.stringify(tpos));

  }

  private getAllPopupOpened():PopupOpened[] {

    try {
        let tpos:PopupOpened[] = JSON.parse(localStorage.getItem("popupOpened"));

        if(_.isNil(tpos)) {
          tpos = [];
        }

        return tpos;

    }
    catch(e) {
        return [];
    }

  }

  private getAllTypeformCount():TyperformCount[] {

    try {
        let tfcs:TyperformCount[] = JSON.parse(localStorage.getItem("totalRecipesDone"));

        if(_.isNumber(tfcs) || _.isNil(tfcs)) {
            tfcs = [];
        }

        return tfcs;

    }
    catch(e) {
        return [];
    }

  }

}
