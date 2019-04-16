//import the Component object from angular/core files
import { Component, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';//Output object is for emitting events outside the current component

import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from '../post.service'
import { ActivatedRoute, ParamMap } from '@angular/router';//the ActivatedRoute gives us some information provided by angular of what the active route is that this component is being rendered to
import { mimeType } from '../post-create/mime-type.validator'//import the validator 
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.services';

//the @Component is a decorator angular understands. @ sign and what follows angular will understand if its a keyword
//at minimum @Component decorator requires a selector and templateUrl
//template: property can be used to write html inside as a string, but for long-term you would define a templateUrl
//the selector tells the templateURL what the name of the html tag will be that angular will use to render the html based on what's in the html file
//styleUrls in an array because you can have many css pages.
//templateURl - you can only have one templateUrl
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create'//by default set this component as a create compponent
  private postId: string;
  private title: string;
  private content: string;
  public post: Post;
  public isLoading = false;
  form: FormGroup; //need to now define the form programmatically. Need to store it in form of type FormGroup. FormGroup is a top level of Form. 
  imagePreview: string;
  private authStatusListener: Subscription;


  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService){};//when component is initialized, run the constructor and get and set postsService
  //when the component is initialized, the ActivatedRoute type binded to the property called route provides some information as to the route we are currently on
  //property from the PostsService service

  ngOnInit() {
    //V5 V5 V5 -- error handling
    //add the authStatusListener to this component so that whenever the status of the user changes, we know either they were logged out or logged in,
    //in which case we know nothing should be loaded after that fact, so we want to remove the spinner from the post-create-component if it's spinning
    this.authStatusListener = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus=>{
      this.isLoading = false;
    })
    
    //this is how you would define a form with options on how to define a form field with validations, default values, etc. 
    //formControl first argument is the default value of the field you are defining. second argument can be used for setting validations, options. 
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    }) 
    //it is good practice you do not do anythign with routes inside the constructor, but rather do it in the ngOnInit when the component is initialized
    //you can extract certain things from the param of the URL by following
    //.paramMap is an observable so you have to subscribe to it and all built in observables we never need to unsubscribe. although unsubscribe could be done to free up memory
    //params are observables because they could change while you are on a certain page, for example for postId parameter you could have clicked on some link to Edit another post, so while you are the same page, the param would change
    //paramMap: ParamMap send to the callback function of .subscribe() so that you can see what properties of that ParamMap type are coming in
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      //if the Url has a postId param, than we are under the edit option of this component. so get the postId from the URL.
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');//set the postId of this component to the postId from the URL
        //console.log('postid: ', this.postId);
        //this.post = this.postsService.getPost(this.postId);//set the post property in this component to whatever postId was received from the .getPost() method for the postServices
        this.isLoading = true;
        //v2 - since we changed .getPost() method to return an observable, we can just call the function and .subscribe to it rather than setting a property like above line
        //do not need to unsubscribe because angular will take care of it
        this.postsService.getPost(this.postId).subscribe((postData)=>{
          console.log(postData);
          this.post = {id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,//once you add imagePath to the return object of .getPost() in postsServices.ts
            //V4 V4 V4 -- when fetching a post - set the creator userId as part of the object. also send this back from post.services.ts from the .getPost()
            creator: postData.creator
          };
          //this.postId = postData._id;
          //this.title = postData.title;
          //this.content = postData.content;
          this.isLoading = false;

          //ReactiveFormsModule additions 
          //add this to load the title and content value in case the "edit" button was clicked
          //setValue would need to set all values of the formControls. 
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath//add this once you add the update feature of editing images. you want the image path set when the user clicks edit button so imagepath is populated
          })
        })

        //if postId is not found in URL, we are on default page of this component, which is just to create
      } else {
        this.mode = 'create';
        this.postId = null;
        this.title = null;
        this.content = null;
      }
    });
  }

  //postCreated can be anything you want. It is the name of the event you are emitting
  //once you start using the PostsService service, you no longer need an @Output decorator to emit your event because the servie will
  //inject that object to components using that service.
  //@Output() postCreated = new EventEmitter<Post>();//Output decorater turns this event so that it can be listened to from outside



  //the PARENT component where your selector above is rendering is the PARENT component.
  //and the component listening would be where you have this compnent being rendered to above in the "selector" so wherver that tag is, that's the component that
  //would be listening to events from this component
  //EventEmitter() is a generic type method which means you can pass additional information about which types of data it works with
  //define a generic type object by "<>" and inside would be the name of the object of the generic type

  //enteredValue = '';//this is the property binded the ngModel
  //newPost = ''//this is a property with no let,const, var in front of it. this property can be used in the html file to render a value to it from the ts file
  //add any referenced element as an argument to the function called
  //also tell the component what kind of object it is, which makes auto complete code easier to know what object it is
  // onAddPost(postInput: HTMLTextAreaElement) {
  //  //alert('Post added!');
  //  //console.dir(postInput);
  //  this.newPost = postInput.value;
  // }

//the argument is just a default javascript Event type you are expecting 
onImagePicked(event: Event) {
  //not having the (as HTMLInputElement) will not work since event.target.files does not know that the target field is an input field. 
  //so you use (as HTMLInputElement) to convert the event.target to whatever you have after "as" and then you can access the .files property
  const file = (event.target as HTMLInputElement).files[0];//files is an array of files so take the first element of that array
  //this.form.patchValue sets only 1 control you define. 
  //so here you are setting the image control to the file object. the file object is not just a text, it is the javascript file object.
  this.form.patchValue({'image': file});
  this.form.get('image').updateValueAndValidity();//this tells the form to re-evaluate the 'image' control and update it's validity on the page. so if the field was 
  //coming back as invalid before this function, you would want to tell angular to re-evaluate it so that the invalid error would go away.
  //console.log(file);
  //console.log(this.form)

  //FileReader() will allow you to read a file. it is a constructor so you would have to instantiate it 
  const reader = new FileReader();

  //execute a function when the dom is done loading a resource that was attached. this will get called when it's done reading a file
  //this is an async code, which is why we have the callback, so when the reader class is instantitated, this function will get called as the callback function
  reader.onload = () => {
    //type casting, tell reader.result is a string so that it can be assigned to imagePreview which is a string. 
    this.imagePreview = <string>reader.result;
  }
  //this tells reader to actually load the file. so the function above can kick off
  reader.readAsDataURL(file);
}


 //since adding directive two-way binding on the element use below syntax rather than above
 //no longer need to pass in the element individually since the directive will automatically update the value on each time this function is ran by whatever element
 //form: NGform we know what will enter in this function is a form of a ngForm directive object. So we have access to the elements inside that form
 //after adding ReactiveFormsModule you do not have the form: NgForm being passed into this method.
 //onSavePost(form: NgForm) {
 onSavePost() {
    //alert('Post added!');
    //console.dir(postInput);
    //this.newPost = this.enteredValue;
    // const post: Post = {//the post object is that of a Post[] list defined in interface post.model.ts
    //   title: this.enteredTitle,
    //   content: this.enteredContent
    // };
    //new Version after adding Form tag and using directives ngForm
    //if any of the form fields were required or had minlegths which would cause an invalid form, enter here

    // if (form.invalid) {
    //   return;
    // }
    //after adding ReactiveFormsModule 
    //you no longer have just form. Except you have this.form
    // if (this.form.invalid) {
    //   return;
    // }
    //whenever creating a post, show the isLoading spinner. do not need to reset it to false
    //because once you add a new post, the page goes to the main page anyway, which there it is defaulted to 
    //false so spinner will go away again
    this.isLoading = true;

    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);//emit the post object from an instance of the EventEmitted class called postCreated event so that other components can listen to this emit

    //once start using the PostsServices service, you no longer need the several codes above. replace the several codes with below
    //the below will call the addPost() method in postsService service, and the service has an Injectible decorator which will allow that
    //posts array to be used from other components using that service
    //this.postsService.addPost(form.value.title, form.value.content)

    //V3 after adding routing of adding and updating posts to this component use following code instaed of line above
    if (this.mode === 'create') {
      //add the image to this arguments 
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);//these are controls of the form. 
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }

    //form.resetForm();//no longer needed after adding ReactiveFormsModule
    this.form.reset();//reactiveFormModule is just reset();

  }
  //V5 V5 V5 -- error handling
  ngOnDestroy() {
    this.authStatusListener.unsubscribe();//unscubscribe to the subscription once this component is destructed. so that it frees up memory
  }
}
