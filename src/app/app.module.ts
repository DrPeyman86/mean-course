import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'//this is the library needed to import to be able to use directives. not loaded by default
//the ReactiveFormsModule replaces normal FormsModule which is a template form method of handling form inputs and submissions.
//ReactiveFrosmModule allows to define in typescript the form fields and validate reactively.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';//this module is needed to send/recieve http requests from a backend code
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

//Angular is based on creating components for each different part of the page.
//so the toolbar buttons can be a seperate component.
//the search textbox can be a seperate component.
//the footer can be a seperate component.
//components can be used duplicated on other pages also. such as the search textbox component.
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsService } from './posts/post.service';//you can add this service to the providers[] array in bottom. One of the methods of adding service to the angular app
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signUp/signUp.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
//import the component you want to register first
//after the module is started, angular will reguster these certain components
//which are declared. It also imports BrowserModule which is a module for browser framework.
//it detects the bootstrap array and then looks on the page its running on for the
//selects of the AppComponent in this case

//all components added other than the index.html will need to be added to the app.component
//Providers are where you define services. like post.service.ts
@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignUpComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,//name of the Router defined in app-routing.module.ts
    //FormsModule,//this was repalced by ReactiveFormsModule
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,//add the FormsModule directives package inside here
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  //add Interceptors here in the providers array as an object. 
  //provide: is needed to tell Angular that 
  providers: [
    {
      provide: HTTP_INTERCEPTORS, //provide a token HTTP_INTERCEPTORS which is an identifier by the http package which Angular will look for, the Http client, for this token/identifier we want to provide a new value
      useClass: AuthInterceptor, //useClass is what we want to use instead as the token/identifier for the Http Client. so set the interceptor to where the interceptor is located. 
      multi: true//multi set to true means that if there are other default interceptors, do not eliminate them from the app, just add this one we added to the list of interceptors
    },
    {
      provide: HTTP_INTERCEPTORS, //provide a token HTTP_INTERCEPTORS which is an identifier by the http package which Angular will look for, the Http client, for this token/identifier we want to provide a new value
      useClass: ErrorInterceptor, //useClass is what we want to use instead as the token/identifier for the Http Client. so set the interceptor to where the interceptor is located. 
      multi: true//multi set to true means that if there are other default interceptors, do not eliminate them from the app, just add this one we added to the list of interceptors
    }
  ],
  bootstrap: [AppComponent],
  //since we load this errorComponent neither through a selector nor through routing, we have to tell angular that it needs
  //to be prepared to eventually create this component. components normally detect it needs to be prepared by somehwere using the 
  //selector which initializes a component or that we use it as a component in the router, but since we create this component
  //dynamically or let that dialog service create it dynamically, we need to tell angular this is going to happen, otherwise we
  //would get error
  entryComponents: [ErrorComponent]//this simply tells angular this component is going to get used even though angular can't see it
})
export class AppModule { }
