import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signUp/signUp.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
  { path: 'signup', component: SignUpComponent}//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
]

@NgModule({
  imports: [
    //do not use forRoot() here since that would load the routes from the root of the app, meaning the routes will get loaded at initial app startup.
    //use forChild() which means the child routes will be merged with the root router eventually
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class AuthRoutingModule{}
