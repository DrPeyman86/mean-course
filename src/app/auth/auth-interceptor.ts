import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.services'

@Injectable()//the service that is receiving something from another service is the service that needs to have the @Injectable() keyword. 
//so this interceptor service(interceptors are basically just another service) is requesting the token from the authService service, so that's why need to have 
//@injectable() here

//this is an interceptor where it will intercept all Http outgoing requests
//the interceptor implements an interface provided by Angular framework called "HttpInterceptor"
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    //the HttpInterceptor interface forces the "intercept()" method to be added to the class. because angular will call this "intercept" method 
    //the req argument is the request that is outgoing, which is why it's a HttpRequest type. <any> just means intercept "any" outgoing requests
    //next just means that when this intercept is done, it should continue with the outgoing request. if no next is called, it will not leave the 
    //interceptor and will not continue with the Http request
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();//this will get the token from the authService
        //now manipulate the original request to include the token in it
        //you cannot manipulate the original request and send it to continue. It will cause unwanted behavior. 
        //so you need to clone() the original request and set it as a new request basically. one that will include the token
        const authRequest = req.clone({
            //headers is the property of the req we are wanting to manipulate so that's why key is headers. 
            //req.headers value is the original header's value. so if you do headers: req.headers it will just set the headers to what they were before
            //use .set() to set a key property of the headers, in this case "Authorization". If "Authorization " was set before this interceptor, it will override it.
            //include the "Bearer " string because that is a normal convention of having that in requests with token and back-end expects this
            headers: req.headers.set('Authorization', "Bearer " + authToken)//
        });

        //return next.handle(req);//this will make the interceptor continue with the normal Http request outgoing process. you could just have this in your intercept and nothing else and 
        //the interceptor will not do anything and just continue with normal http request.

        return next.handle(authRequest);//send the new cloned request to continue with the Http request. 
    }
}