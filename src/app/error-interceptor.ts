import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
//this is an interceptor where it will intercept all Http outgoing requests
//the interceptor implements an interface provided by Angular framework called "HttpInterceptor"
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog){};

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        //want to listen to the response and handle() gives back the response observable stream so
        //just hook to that stream and listen to events by using pipe() method to add an operator to that 
        //stream.
        return next.handle(req).pipe(
            //catchError is a special operator from pipe() method
            catchError((error: HttpErrorResponse)=>{
                let errorMessage = 'An unknown error occurred';
                if(error.error.message) {
                    errorMessage = error.error.message;
                }
                //console.log(error);
                //V5 V5 V5 -- error handling - add the ErrorCOmponent through the dialog module. The ErrorComponent gets initialized like this
                //not like other components where a selector is added to an html page and that selector initialized the component. 
                //you can pass stuff to the component you are opening so that the component can display certain wording based on what you send in
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                //alert(error.error.error.message)//the error will have a property called error. and that will have a property "message" defined throughout the app
                //because this intercept is used on http requests made by servives in the app and services return a
                //subscription(), we need to return an observable from this intercept back to the stream. stream meaning the 
                //flow of operations in the app. 
                return throwError(error)//throwError() will throw an observable. so just return the error as an observable
            })
        );//send the new cloned request to continue with the Http request. 
    }
}