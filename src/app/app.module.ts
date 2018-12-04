import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'//this is the library needed to import to be able to use directives. not loaded by default
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';//this module is needed to send/recieve http requests from a backend code
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule
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
    PostListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,//add the FormsModule directives package inside here
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
