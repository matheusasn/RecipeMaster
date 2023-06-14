import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitListComponent } from './unit-list/unit-list.component';
import { UnitEditComponent } from './unit-edit/unit-edit.component';
import { UnitSelectComponent } from './unit-select/unit-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatDialogModule
  ],
  exports: [UnitSelectComponent],
  declarations: [UnitListComponent, UnitEditComponent, UnitSelectComponent],
  entryComponents: [UnitEditComponent, UnitListComponent, UnitSelectComponent]
})
export class UnitinfoModule { }
