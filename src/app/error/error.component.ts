import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './error.component.html'
})

export class ErrorComponent {
    //message = 'An Unknown error occurred';
    //to retrieve the data that was passed in from error-interceptor.ts, need to use special decorator @Inject
    //which allows you to set properties inside a component from outside of the component
    //@Inject allows you to specify a special token that is important for the dependency injection system that angular uses
    //to identify the data you are passing around. this speical decorator is required due to the special way 
    //this error component is getting created with, being created from the error.interceptor.ts
    //The token is the MAT_DIALOG_DATA token 
    //the token will hold "data" which is of type object that we know will have message property that is a string
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}
}