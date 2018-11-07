import { Component } from '@angular/core';
//import { Post } from './posts/post.model';//no longer need after postservices service is added

@Component({
  selector: 'app-root',//this is the custom html selector that will render based on what angular tells it
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'mean-course';
  //storedPosts = [];
  //once you add the Post interface change above line to this
  //storedPosts: Post[] = [];//this is a typescript syntax saying there is an array of posts in here. Post is an array of Post[] object interface
  //V2-after posts services, you can remove line above since you do not need to set it here since it's already being set in the post.service.ts

  //onPostAdded funciton runs when the event is triggered from the .html file. That event gets triggered by posts.create.component.ts
  //a single (post) is coming from the post-create.component.html/.ts and enters this function as argument so you can push it to an array
  //defined PostCreated event name. The postCreated event passes a (post) object with it, so we can expect it here in this onPostAdded
  
  // onPostAdded(post) {
  //   this.storedPosts.push(post);//push the new post to this list defined in this component
  // }

  //V2 once you move to postsServices servive structure, you do not need to listen to custom events and set properties like above. 
  //comment out several lines above. the postsServices will be getting/setting the object needed all from the post.service.ts file
  
}

