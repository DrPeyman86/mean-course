//import the Component object from angular/core files
import { Component } from '@angular/core';

//the @Component is a decorator angular understands. @ sign and what follows angular will understand if its a keyword
//at minimum @Component decorator requires a selector and templateUrl
//template: property can be used to write html inside as a string, but for long-term you would define a templateUrl
//the selector tells the templateURL what the name of the html tag will be that angular will use to render the html based on what's in the html file
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})

export class PostCreateComponent {
  enteredValue = '';//this is the property binded the ngModel
  newPost = 'no content'//this is a property with no let,const, var in front of it. this property can be used in the html file to render a value to it from the ts file
  //add any referenced element as an argument to the function called
  //also tell the component what kind of object it is, which makes auto complete code easier to know what object it is
  // onAddPost(postInput: HTMLTextAreaElement) {
  //  //alert('Post added!');
  //  //console.dir(postInput);
  //  this.newPost = postInput.value;
  // }
 //since adding directive two-way binding on the element use below syntax rather than above
 //no longer need to pass in the element individually since the directive will automatically update the value on each time this function is ran by whatever element
 onAddPost() {
  //alert('Post added!');
  //console.dir(postInput);
  this.newPost = this.enteredValue;
}
}
