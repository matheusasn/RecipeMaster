import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitLabelPipe } from './unit-label.pipe';
import { UnitFilterPipe } from './unit-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UnitLabelPipe, UnitFilterPipe],
  exports: [UnitLabelPipe, UnitFilterPipe],
  providers: [UnitLabelPipe]
})
export class SharedPipesModule { }
