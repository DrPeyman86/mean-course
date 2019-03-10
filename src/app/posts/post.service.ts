import { Post } from './post.model';
import { Injectable} from '@angular/core';//needed when adding the @Injectable()
//Observables??? -- essentially help us pass objects around
//without observables, if you add a post in post-create, even though the post will be added to the posts array by the
//addPost() method. however post-list is calling getPosts() and renaming that array to something else, so it won't know what is inside
//of that array at that point.
//one option is to not rename that array in getPosts() method. so just have {return this.posts} rather than return [...this.posts]
//another option is to use observables by using the rxjs package that comes with angular.
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';//import the httpclient to components or services in this case that you want the backend to communicate with
import { stringify } from '@angular/core/src/render3/util';
import { Router } from '@angular/router';//router provides tool to the service so that when certain methods are finisehd, you can re-route the page to different pages

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
  //will give you the same results. The @Injectable option is less work. ALso the @Injectable directive only gives you one instance of this service,
  //whereas if you define this service in app.module.ts, it would give you multiple instances of this service, whereever it is being used from. so than in that
  //case posts[] will not be the same every instance this service is being initizalied. So the @injectable giving 1 instance is the best method
})

export class PostsService {
  //reference type is
  //you do
  private posts: Post[] = [];//Post model is an array. private makes it a private property cannot be access from outside this class
  private postsUpdated = new Subject<Post[]>();//send the Post type array to the Subject generic type


  //set the router property which is of type Router from angular
  constructor(private http: HttpClient, private router: Router) {}//inject the HttpClient to this service. Bind a private HttpClient type to the property named http or whatever you wanted

  //return the posts if they call this method
  getPosts() {
    //Primitives????
    //you do not want to return the original posts array because arrays and objects in JS and typescript are reference types
    //reference types are types where if you copy it, you don't really copy it. the object in memory will stay the same. you just copied the address
    ///so the pointer pointing to that object
    //so to make a true copy of the posts array, need to use typescript and NExGen JS feature called "spread operator"
    //you use the "spread operator" by adding square brackets to create the new array from posts array prefixed by three dots to take all the elements from
    //the posts array to the other array created

    //return [...this.posts];//create a new array from the old posts array using spread operator.

    //if you add/remove elements from other components to the new copied array, it will never effect the original array

    //V2 after adding httpClient to this code. use the following code
    //a http request returns a response as observables. In this scenario, you have to .subscribe() to the response of that http request. otherwise it won't run the http request.
    //because why would you want to make a request to something if you are not interested in what it sends back.
    //in a http subscription, you do not have to .unsubscribe() something on ngOnDestroy() for example. When other requests are made, angular will automatically unsubscribe to what was received previously and so on.
    //.get() is a generic type function. meaning you can specify what type of data you expect to get back
    this.http
      .get<{message: string, posts: any}>(//post type is no longer Post[] because posts coming from backend is with an "underscore" in front of id...so change to any for now.
        'http://localhost:3000/api/posts'
        )
      //.pipe a method that accepts certain observable operators where you can manipuate the data coming in from the http request before the data is handled in the subscription
       //map is an observable operator method expects an object/argument that is the object that comes back from the observables stream. so in .get() request, it expects that returned result
      .pipe(map((postData)=>{
        //map takes an array and can replace all properties with some other property and return it as a new array. .pipe() will also return an Observable so the .subscribe can still subscribe to it
        return postData.posts.map(post=> {
          //every element called "post" here will be retuned as a new object defined below so that the properties of that object matches with the Post[] array defined.
          return {
            title: post.title,
            content: post.content,
            id: post._id,//_id is what we get from backened, so we need to set that to just "id" since in frontend we are using id.
            imagePath: post.imagePath
          };
        });
      }))//place a pipe to manipulate the data before the .subscribe chain so that you may want to rename some fields to match with what's in front-end. like "_id" to "id". pipe() is an obserable method that accepts certain operators
      .subscribe((transformedPost)=>{
        //postData is the response of that request. could call it whatever you want. the first argument in .subscribe is the response
        this.posts = transformedPost;//set this.posts to whatever is coming in from the backend code
        this.postsUpdated.next([...this.posts]);
      });

  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();//return the postUpdated subject as object that we can listen to. postsUpdated is private so we can't emit from other components, but we can pass the value to the components
  }

  //method to get posts that have an Id.
  getPost(id: string) {
    //use the "spread operator" to copy the original array to a new object so that you do not accidently overwrite the original array
    //return {...this.posts.find(post => post.id === id)};//use the .find() method to search all posts array. return the single post that matches with the id that was sent into this method.
    //the above line returns a post
    //if we make a http request here this will be asynchronous code and you can't return inside a subscription. you need to return syncrhonously.
    //V2 - to add ability to refresh the edit/create page so that the posts being edited will populate back
    //this.http.get already returns an observable, so whereever this method is being called, you can just subscribe to it
    //add the imagePath because you expect it returned as the backend
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + id
      );
  
  }

  //method to call by components to add a post to the posts array
  addPost(title: string, content: string, image: File) {
    //const post: Post = {id: null, title: title, content: content};//issue here was when we set id: null and immediately send this id of null back to front-end, if we wanted to delete that post it wouldn't have a id value. so that
    
    //JSON CAN"T INCLUDE A FILE. When you want to send files to backened. Need to send Form Data instead of JSON
    const postData = new FormData();//FormData is a javascript objct that provides text values and blob data(blob means file values)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)//this image property is exactly what the backend is looking for. so name them the same. second argument is the file. third is the title of the file you want
    //deletion process would fail.
    //option 1: to call getPost() after the .subscribe(), inside of it. so that it will fetch the newly posts so that the "id" field will also get its value. Not best option because that would get back every post after just one post addition. redundant.
    //option 2: better option - get back the id that was newly created. Do this in app.js in backend code
    //emit an event to the backend here. post receives back a generic type object, which we know it will just be a message that is
    //of string type.
    //for the .post() method, you pass a second argument of what you want to post to that path URL
    //the generic types are what you expect from the backend and of what type they are
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)//changed from "post" after adding "File" feature
      .subscribe((responseData)=>{
        //console.log(responseData.message);
        //if you have these lines inside the .subscribe() it will only add the newly post if and only if the post was added to the server
        //successfully. Because the .subscribe() will only run if the backend code returns no errors.
        
        //const postId = responseData.postId;
        //post.id = postId;//update the post object defined above where the id was initially null...to update its "id" property to the "id" returned from backend so that the front-end will know of its value the first time without needing to reload page.
        
        //after adding File Feature
        //need to save the post after the backend returns no errors
        const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};//we do not get the image yet back from backend, TODO TODO TODO

        
        this.posts.push(post);//push the new post to the array post
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"])//pass as argument an array of segments. send the page back to the main page since the main page is just "/"
      })
    //if these 2 lines are outside the .subscribe right above, it is called optimistic updating the front-end because you are adding the
    //post to the posts list without knowing for sure that the backend accepted the newly post. if you don't want optimistic updating,
    //move the lines inside the .subscribe()
    //this.posts.push(post);//push the new post to the array post
    //also push the array that was renamed to the Subject. next is like push() and also emit(). So when you use .next() you can listen
    //to it afterwards
    //this.postsUpdated.next([...this.posts]);
  }

  //when adding the Update feature to the image feature. add image as argument. It can be of type File or String because when editing, you either have the regular image URL path,
  //or if image was editted, it would be a new image all together, so it would be of type File. so have either or."image: File | String"
  updatePost(id: string, title: string, content: string, image: File | String) {
    let postData: Post | FormData;//initialize postData first because typescript won't know whether postData is going to be of type Post or FormData.
    //const post: Post = { id: id, title: title, content: content, imagePath: null };
    //typeof(image) object would mean it is a file because a file is a object. whereas a string is just a string
    if(typeof(image)==="object") {
      postData = new FormData();
      postData.append("id", id)//add this otherwise it will break backened because you would be trying to update an _id in MOngoDB without sending an ID. need the ID so that it can generate a new ID when updating
      postData.append("title", title);
      postData.append("content", content);
      //since in the arguments you have Image can be either an image or string, you have use generic types <File> to say that this image object is actually going to be a File
      //since we already know it will be a file since the IF above. 
      postData.append("image", <File>image, title)//this image property is exactly what the backend is looking for. so name them the same. second argument is the file. third is the title of the file you want
    
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }
    this.http.put<{message: string, postId: string}>('http://localhost:3000/api/posts/' + id, postData)//send the id along with the URL. 2nd argument is the payload you are sending to backend
      .subscribe((response)=>{
        //console.log(response);
        //without refreshing the page, want to be able to update the front-end with the newly updated post data
        const updatedPosts = [...this.posts]//first create a new array of exactly the same array
        const oldPostIndex = updatedPosts.findIndex(p=>p.id === id)//findIndex() takes a function that will return where some logic is defined. here we want to 
        //find the p.id in the updatedPosts array that equals the post.id value that was updated so that we can update the data on that post
        
        //define the post that was edited so that it can be updated below
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: 'response.imagePath'
        }
        updatedPosts[oldPostIndex] = post;//set the index of the array to the newly updated data
        //console.log(post.id);
        //console.dir(updatedPosts);
        this.posts = updatedPosts;//reset the original posts array property to the updatedPosts defined
        //tell the app with this event by calling .next() and sending postsUpdated which is a subject
        this.postsUpdated.next([...this.posts]);//
        this.router.navigate(["/"])//send the page back to the main page since the main page is just "/"
      })
  };

  deletePost(postId: string) {
    //console.log('postId:',postId);
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(()=>{
        console.log('deleted');
        //create a new updatedPosts array after deleting the one that was requested.
        //filter returns a subset of the array we use based on what value you pass in the filter. filter loops through the array of posts or whatever array you provide.
        //every array with a property name defined below that matches the postId that was deleted, will return false. meaning they should be filtered out.
        //all others post array that do not match that postId, will return true and they will still show on front-end
        const updatedPosts = this.posts.filter(post=>{
          return post.id !== postId;//postId is what we deleted, so return every other post.id that is not equal to postId as true, which means those post.id will go inside the updatedPosts
        })
        this.posts = updatedPosts;//set the array Posts to the new updated posts array after deletions
        this.postsUpdated.next([...this.posts]);
      })
  }


}

