import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule
} from '@angular/material';

//@ngModule will just turn this into an angular Module.
@NgModule({
  //import imports them to this module from the angular/material framework.
  //Angular provides a feature where you can just export modules rather than importing and exporting to remove code duplication.
  // imports: [
  //   MatInputModule,
  //   MatCardModule,
  //   MatButtonModule,
  //   MatToolbarModule,
  //   MatExpansionModule,
  //   MatProgressSpinnerModule,
  //   MatPaginatorModule,
  //   MatDialogModule
  // ],
  //you also need exports key to export them back into the app.module.ts where this file is being used
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})


export class AngularMaterialModule {}
