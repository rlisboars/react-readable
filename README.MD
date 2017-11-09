# Readable
A React-Redux project developed for [Udacity React Nanodegree](https://br.udacity.com/course/react-nanodegree--nd019) by [rlisboars](https://github.com/rlisboars/)


## Structure
- server: contains the basic node server created by Udacity. Nothing was changed. Original repository: [reactnd-project-readable-starter](https://github.com/udacity/reactnd-project-readable-starter)
- client:  front-end code where the magic happens.

## Setup

- Install dependencies
```sh
$ npm install
```

- Start server and client simultaneously
```sh
$ npm run start
```

- Or start server and client separately
```sh
$ npm run server
$ npm run client
```

- Run test scenarios
```sh
$ cd /client
$ npm run test
$ npm run test:coverage
```


## Project Requirements
### App configuration:
* Easy setup: 
    * App requires only `npm install` and `npm start` to install and start the app.
* README: 
    * A README was added to the project. It shows the instructions to install and start the project.

### State Management:
* Redux: 
    * Majority of states must be managed by Redux Store. Props based on the status are maped from the store and not saved as a state inside the component.
    * Form inputs and controled components can have some state controled by the component.

* State Update:
    * Updates are started by sending actions to the reducers.
    * Reducers and actions are written properly and return the update state correctly to the store.

### App Features:
* Posts List:
    * Posts are shown with title, author, comments quantity, current score and a voting mechanism allowing to vote in favor or against a post. It must have buttons or links to allow user to edit or delete.
    * The voting mechanism works and shows correctly the new score after a click.
    * Posts have links to the theirs details page.
    * All posts are listed in the main page.
    * All posts of a specific category are listed on `/:category`
    * The list pages (main or by category) includes a mechanism to sort posts by data or score, and this sorting works correctly.
* Post Detail:
    * Post details are available on `/:category/:post_id`.
    * Post is show with title, body, author, comments quantity, currect score and voting mechanism. It must have buttons or links to allow user to edit or delete it. Listed comments are shown with author, current score and a voting mechanism allowing to vote in favor or against a comment.
    * The voting mechanism works and shows correctly the new score after a click.
    * All post comments are listed bellow the post body.
    * A feature to add a comment is visible in the details page and it works.
* Create Posts:
    * App has a form to create new posts.
* Create Comments:
    * App has a form to create new comments into a post.
* Edit posts/comments:
    * Buttons to edit posts/comments opens a form with data already filled. Changing the content updates the data correctly in the post/comment.
* Remove posts/comments:
    * There is a feature to remove posts/comments. Clicking on a button/link removes the post/commemt from the list view and makes it unavailable through URL.
* Navigation:
    * User is capable to navigate between details page, main page and categories without having to type its address in the navigation bar.