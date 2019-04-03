import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms'//this is the library needed to import to be able to use directives. not loaded by default
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//the ReactiveFormsModule replaces normal FormsModule which is a template form method of handling form inputs and submissions.
//ReactiveFrosmModule allows to define in typescript the form fields and validate reactively.


@NgModule({
 //the same key's need to be used here in this module than they would be used if you had placed these modules in the app.module.ts. So if something
 //belongs in the declarations array, you would use declarations.
 //because PostCreateComponent and PostsListComponent are part of the router module. the router module is a spcial because it is managed globally, which is why you do not need to explicity export these components
 //
 declarations: [
  PostCreateComponent,
  PostListComponent
 ],
  //just need exports key. imports you can skip since angular takes care of the import automatically.
 imports: [
  ReactiveFormsModule,
  AngularMaterialModule,//since the posts components use certain feature of the AngularMaterialModule such as the "mat-spinner" feature, you need to include it here so that the posts component can use these modules also, otherwise
  //it will error
  CommonModule,//CommonModule includes things such as ngIf which is also used in posts components. so if you do not have them in this module, it will error out. so include it here.
  RouterModule//RouterModule is also used in posts components where it routes to different pages of the app, otherwise it will error out.
 ]
})

export class PostsModule{}
