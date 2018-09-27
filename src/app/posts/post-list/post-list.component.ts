import { Component, Input } from "@angular/core";//like Output, since in this component we are listening rather than emitting,
//use Input instead.

import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s conent"'},
  //   {title: 'Second Post', content: 'This is the Second post\'s conent"'},
  //   {title: 'Third Post', content: 'This is the Third post\'s conent"'}
  // ];
  @Input() posts: Post[] = [];//make the post property bindable from outside by property binding
  //add the @Input decorated bind to the posts list
  //Post[] creates that interface defined so that posts coming into this component will adhere to the Post interface defined in post.model.ts
}
