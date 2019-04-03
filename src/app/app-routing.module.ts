import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"//enable the Angular Router. Without this, you can't use the Angular Router.
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
// import { LoginComponent } from './auth/login/login.component';//V6 v6 v6 -- moved to auth-routing.module.ts file since we want to do lazy loading on these components.
// import { SignUpComponent } from './auth/signUp/signUp.component';//V6 v6 v6 -- moved to auth-routing.module.ts file since we want to do lazy loading on these components.
import { AuthGuard } from './auth/auth.guard';
//routing modules are used to create routes between different components to render different pages
//routing modules could be added to the regular app.module.ts file, but it is good practice to split the routings apart so that they are not all bunched up together in one file.

//routes are just javascript objects that define which URL should hold which components to render that URL with
const routes: Routes = [
  { path: '', component: PostListComponent },//the first object inside the Routes holds an empty string path property, which is basically the root page that app first loads. Hence it is empty.
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},//path property you don't need the slash. just have the route. And the component says what component should render if we are on that path
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page

  //V6 V6 V6 -- optimization -- adding lazy loading to the login/signup routes.
  //we can tell the router to only load code when we need it. for example these login/signup because we don't always need them, so loading these components in advance is redundant and would slow performance
  //loading these routes lazily (lazy loading) so only when we need them, which ANgular Router can do. create a seperate module for lazy loading components. like auth-routing.module.ts in auth folder.
  //removed from here and moved to auth-routing.module.ts
  // { path: 'login', component: LoginComponent},//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
  // { path: 'signup', component: SignUpComponent}//the edit path accepts a parameter to be sent along with that route. postId is name of the paramenter which can be used once in the /edit page
  //you have to specify a path, but it can't be any path that has been taken like '' or 'login' because then angular will put 2 login/login/ in the URL. So create a new path.
  //instead of loading a component here in the lazy loading route. use loadChildren key since in auth-routing.module.ts file we used forChildren(). The loadChildren takes a string of the module you
  // want lazy loaded. Followed by a hash sign, then the name of the Module that was exported in auth-routing.module.
  //this is what loads the AuthRoutingModule now az a lazy loading method, before AuthRoutingModule was included in app.module.ts
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}

]//imported from the angular package

@NgModule({
  imports : [RouterModule.forRoot(routes)],//need to inform the Angular Router module about our routes we have defined.
  exports: [RouterModule],//have to export the RouterModule so that we can use it in app.module.ts
  providers: [AuthGuard]
})
export class AppRoutingModule {}
