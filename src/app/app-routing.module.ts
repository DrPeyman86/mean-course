import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"//enable the Angular Router. Without this, you can't use the Angular Router.
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signUp/signUp.component';
import { AuthGuard } from './auth/auth.guard';
//routing modules are used to create routes between different components to render different pages
//routing modules could be added to the regular app.module.ts file, but it is good practice to split the routings apart so that they are not all bunched up together in one file.

//routes are just javascript objects that define which URL should hold which components to render that URL with
const routes: Routes = [
  { path: '', component: PostListComponent },//the first object inside the Routes holds an empty string path property, which is basically the root page that app first loads. Hence it is empty.
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},//path property you don't need the slash. just have the route. And the component says what component should render if we are on that path
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
  { path: 'login', component: LoginComponent},//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
  { path: 'signup', component: SignUpComponent}//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
]//imported from the angular package

@NgModule({
  imports : [RouterModule.forRoot(routes)],//need to inform the Angular Router module about our routes we have defined.
  exports: [RouterModule],//have to export the RouterModule so that we can use it in app.module.ts
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
