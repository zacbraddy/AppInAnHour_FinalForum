import React, { Component } from 'react';
import Post from '../../Post/components/Post';
import PostEditor from '../../PostEditor/components/PostEditor';

class ThreadDisplay extends Component {
  constructor(props) {
    super(props);

    this.databaseRef = this.props.database.ref().child('post');
    this.addPost = this.addPost.bind(this);
    this.updateLocalState = this.updateLocalState.bind(this);

    this.state = {
      posts: [],
    }
  }

  componentWillMount() {
    const {updateLocalState} = this;
    this.databaseRef.on('child_added', snapshot => {
      const response = snapshot.val();
      updateLocalState(response);
    });
  }

  addPost(postBody) {
    const postToSave = {postBody};
    this.databaseRef.push().set(postToSave);
  }

  updateLocalState(response) {
    const posts = this.state.posts;
    const brokenDownPost = response.postBody.split(/[\r\n]/g);
    posts.push(brokenDownPost);
    this.setState({
      posts: posts,
    });
  }

  render() {
    return (
      <div>
        {
          this.state.posts.map((postBody, idx) => {
            return (
              <Post key={idx} postBody={postBody}/>
            )
          })
        }
        <PostEditor addPost={this.addPost}/>
      </div>
    );
  }
}

export default ThreadDisplay;