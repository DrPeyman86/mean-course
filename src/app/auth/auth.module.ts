//the order matters of when you import. You would want to import modules not dependent on any other module first.
//so if you import LoginComponent/SignUpComponent first before, AngularMaterialModule, it will error since the 2 components require features from the AngularMaterialModule.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';//this is the library needed to import to be able to use directives. not loaded by default

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signUp/signUp.component';

import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,//this unlocks ngIf
    AngularMaterialModule,//angularmaterialmodule is needed because the features in that module are used in the auth components.
    FormsModule,
    AuthRoutingModule//add the AuthRoutingModule to this auth.module.ts which will then get forwarded to the app.module.ts.
  ]
})

export class AuthModule{}
