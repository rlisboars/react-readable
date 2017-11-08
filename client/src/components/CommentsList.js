import React, { Component } from 'react'
import { Menu, Segment, Message } from 'semantic-ui-react'
import HeaderReadable from './Header'
import Post from './Post'
import PostForm from './PostForm'
import Comment from './Comment'
import CommentForm from './CommentForm'
import ListActions from './ListActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getPost } from '../actions'

export class CommentsList extends Component {
    componentDidMount() {
        this.props.getPost(this.props.match.params.id)
    }
    renderBackButton() {
        const { category } = this.props.filters
        return(
            <Menu className='sub-menu' text>
                <Menu.Item>
                    <Link to={ category === 'All' ? '/' : `/${category}`}>
                        Back
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        const { filters, post, changes } = this.props
        if (post && post.error) {
            return (
                <div>
                    <HeaderReadable history={this.props.history}/>
                    <Message negative className='infoMessage'>
                        <Message.Header>
                            {post.error}
                        </Message.Header>
                    </Message>
                </div>
            )
        }
        const sortBy = filters.sortByComment
        let postComments = this.props.postComments 
                            ? this.props.postComments.slice().filter(cmt => cmt.deleted === false) 
                            : []
        
        if (postComments) {
            switch (sortBy) {
                case 'recent':
                    postComments.sort((prev, curr) => curr.timestamp - prev.timestamp)
                    break
                case 'score':
                    postComments.sort((prev, curr) => curr.voteScore - prev.voteScore)
                    break
                default:
                    break
            }
        }

        const postId = this.props.match.params.id
        if (!post) {
            return (
                <div>
                    <HeaderReadable disabled />
                    {this.renderBackButton()}
                    <Message negative className='infoMessage'>
                        <Message.Header>Post id '{postId}' not found!</Message.Header>
                    </Message>
                </div>
            )
        } else {
            return (
                <div>
                    <HeaderReadable disabled />
                    {this.renderBackButton()}
                    { filters.isCreatingPost && post.id === changes.editingPost &&
                        <PostForm />
                    }
                    { !filters.isCreatingPost &&
                        <Post data={post} comments={postComments} detailed/>
                    }
                    <ListActions comment />
                    <Segment.Group>
                        {filters.isCreatingComment && !changes.editingComment &&
                            <CommentForm parentId={postId}/>
                        }
                        { postComments.length === 0 && !filters.isCreatingComment &&
                            <Message size='mini' color='teal' className='infoMessage'>No comments done yet! Be the first!</Message>
                        }
                        { postComments.length > 0 &&  
                            postComments.map(comment => {
                                if (filters.isCreatingComment && comment.id === changes.editingComment) {
                                    return <CommentForm key={comment.id} parentId={postId}/>
                                } else return <Comment data={comment} key={comment.id}/>
                            })                          
                        }
                    </Segment.Group>
                </div>
            )
        }
    }
}

function mapStateToProps({ filters, posts, comments, changes }, ownProps) {
    if (posts.error) return { filters, post: posts }
    const postsArray = Object.values(posts)
    const post = postsArray.length > 0 ? postsArray.find(p => p.id === ownProps.match.params.id) : undefined
    const postComments = post && comments[post.id] ? comments[post.id] : undefined
    return { filters, post, postComments, changes }
}

export default connect(mapStateToProps, { getPost })(CommentsList)