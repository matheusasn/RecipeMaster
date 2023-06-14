import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nutritionalInfoUtil'
})
export class NutritionalInfoUtilPipe implements PipeTransform {

  transform(value: string, args?: any): any {

    let v:string = value.replace("Não se aplica", "");

    return v;
  }

}
