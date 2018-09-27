import { Component } from '@angular/core';

@Component({
  selector: 'app-root',//this is the custom html selector that will render based on what angular tells it
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'mean-course';
  storedPosts = [];

  onPostAdded(post) {
    this.storedPosts.push(post);
  }
}
