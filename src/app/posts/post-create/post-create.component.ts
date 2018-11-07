//import the Component object from angular/core files
import { Component, EventEmitter, Output } from '@angular/core';//Output object is for emitting events outside the current component

import { Post } from '../post.model';
import { NgForm } from "@angular/forms";
import { PostsService } from '../post.service'

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

export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';

  constructor(public postsService: PostsService){};//when component is initialized, run the constructor and get and set postsService 
  //property from the PostsService service

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
 //since adding directive two-way binding on the element use below syntax rather than above
 //no longer need to pass in the element individually since the directive will automatically update the value on each time this function is ran by whatever element
 //form: NGform we know what will enter in this function is a form of a ngForm directive object. So we have access to the elements inside that form
 onAddPost(form: NgForm) {
    //alert('Post added!');
    //console.dir(postInput);
    //this.newPost = this.enteredValue;
    // const post: Post = {//the post object is that of a Post[] list defined in interface post.model.ts
    //   title: this.enteredTitle,
    //   content: this.enteredContent
    // };
    //new Version after adding Form tag and using directives ngForm
    //if any of the form fields were required or had minlegths which would cause an invalid form, enter here
    if (form.invalid) {
      return;
    }

    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);//emit the post object from an instance of the EventEmitted class called postCreated event so that other components can listen to this emit

    //once start using the PostsServices service, you no longer need the several codes above. replace the several codes with below
    //the below will call the addPost() method in postsService service, and the service has an Injectible decorator which will allow that
    //posts array to be used from other components using that service
    this.postsService.addPost(form.value.title, form.value.content)
    form.resetForm();

  }
}
