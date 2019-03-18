import { Component, Input, OnInit, OnDestroy } from "@angular/core";//like Output, since in this component we are listening rather than emitting,
//use Input instead.
import { Subscription } from 'rxjs'

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s conent"'},
  //   {title: 'Second Post', content: 'This is the Second post\'s conent"'},
  //   {title: 'Third Post', content: 'This is the Third post\'s conent"'}
  // ];
  //@Input()
  isLoading = false;
  posts: Post[] = [];//make the post property bindable from outside by property binding. do this with @Input dectorator
  //once you use the PostsService service, since you will use methods from that class to either get/set your objects, you do not need
  //the @Input decorator above.

  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];

  private postsSub: Subscription;// postsSub is of type of Subscription

  //add the @Input decorated bind to the posts list
  //Post[] creates that interface defined so that posts coming into this component will adhere to the Post interface defined in post.model.ts

  //postsService: PostsService;///define an empty property of type PostService. you can also escape writing this line by just putting "public" in the constructor in front of the service

  //constructor is just a function which is called whenever Angular creates an instance of this component
  //in constructor you can expect arguments, but since Angular is the one creating you the instance of this component, Angular has to give you these
  //arguments with "dependency injection" which angular is able to find out what you want and give you what you wanted
  //postsService: is the service you want to have. PostService is the type you are giving Angular a hint about what Angular should give you
  constructor(public postsService: PostsService) {
    //this.postsService = postsService;
  }
  //or you can omit the above few lines with below.
  //the public keyword in typescript will automatically create a new empty property in the component and store the incoming value in that property
  //constructor(public postsService: PostService) {}//this line will replace the above few lines where you define a property and write out the constructor method like a function.

  //ngOninit is a life cycle hook angular provides where the method will automatically be called every time the component is initialized.
  //so every time a post is created and is sent into post-list, this method will run
  ngOnInit() {
    //set the posts property in this component by calling .getPosts() method of the postsservice service which gets the posts

    // this.posts = this.postsService.getPosts();

    //V2 -- after adding httpClient to post.service.ts, you do not need to set this.posts to the return results of this.postsService.getPosts since it's not returning anyhing.
    //just trigger the method to call the http request now
    //and since we have the .subscribe subscription, you will be able to render the posts once they are there
    // this.posts =
    this.isLoading = true;
    this.postsService.getPosts();

    //add a listener to that Subject
    //once you add Subscription, add the service to that Subscription so that it can be unsubcribed when ngOnDestory runs
    this.postsSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[])=>{
        //posts is what we are receiving from the next() method when adding posts
        console.log('posts', this.posts);
        this.isLoading = false;
        this.posts = posts;
      });//.subscribe sets up a subscription which takes 3 arguments, a function() argument, an error callback, and a complete successfully callback
  }


  onDelete(postId: string) {
    //console.log('posts 0:',postId)
    this.postsService.deletePost(postId);
  }


  //life cycle hook will get called when this component is no longer part of the dom, where memory cleanup will take place
  ngOnDestroy() {
    //by default .subcribe() will create a subscription and store in memory. if the page is gone from DOM the subscription will still exist
    //which will keep the memory. to clear the subscription, we call ngOnDestory and remove the subscription
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

}

