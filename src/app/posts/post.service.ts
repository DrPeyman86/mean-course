import { Post } from './post.model';
import { Injectable } from '@angular/core';//needed when adding the @Injectable()
//Observables??? -- essentially help us pass objects around
//without observables, if you add a post in post-create, even though the post will be added to the posts array by the 
//addPost() method. however post-list is calling getPosts() and renaming that array to something else, so it won't know what is inside
//of that array at that point. 
//one option is to not rename that array in getPosts() method. 
//another option is to use observables by using the rxjs package that comes with angular. 
import { Subject } from 'rxjs';

//service is a typescript class
//service is a class which you can inject into different components. the service is able to centralize some tasks and provide easy access
//to the data the service is meant to keep so that the data can be fetched from diferent components without property and event binding
//services have to be added to the Angular app so that Angular can scan for the services files. otherwise you will not be able to use the service.
//two ways in adding services to your angular app
//you can add services to the angular app by going into the app.module.ts. you will add it the "providers" array
//2. you can add @Injectable decorater to the service
//either method you select, Angular will only create ONE instance of this service to the entire app. this is important because since you would use
//this service in several components, having multiple instances of the service would be bad because we would have multiple copies of different array in there


//after you have created a service, you can use this service inside your components to where this service is imported, without having to do
//property and event binding. once inside the components, a feature called "dependency injection" will allow this feature where you do not need to
//do property or event binding
@Injectable({
  providedIn: 'root'//root is important. provides this service on the root level directory of the app, so that the service is avaialble in 
  //components. You could also go into app.module.ts, import the service you created, and add the service object in the "providers" array. Both
  //will give you the same results. The @Injectable option is less work
})
export class PostsService {
  //reference type is
  //you do
  private posts: Post[] = [];//Post model is an array. private makes it a private property cannot be access from outside this class
  private postsUpdated = new Subject<Post[]>();//send the Post type array to the Subject generic type

  //return the posts if they call this method
  getPosts() {
    //Primitives????
    //you do not want to return the original posts array because arrays and objects in JS and typescript are reference types
    //reference types are types where if you copy it, you don't really copy it. the object in memory will stay the same. you just copied the address
    ///so the pointer pointing to that object
    //so to make a true copy of the posts array, need to use typescript and NExGen JS feature called "spread operator"
    //you use the "spread operator" by adding square brackets to create the new array from posts array prefixed by three dots to take all the elements from
    //the posts array to the other array created
    return [...this.posts];//create a new array from the old posts array using spread operator.
    //if you add/remove elements from other components to the new copied array, it will never effect the original array
  }
  
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();//return the postUpdated subject as object that we can listen to 
  }

  //method to call by components to add a post to the posts array
  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);//push the new post to the array post
    //also push the array that was renamed to the Subject. next is like push() and also emit(). So when you use .next() you can listen
    //to it afterwards
    this.postsUpdated.next([...this.posts]);
  }


}
