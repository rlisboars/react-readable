import React, { Component } from 'react'
import HeaderReadable from './Header'
import Post from './Post'
import PostForm from './PostForm'
import ListActions from './ListActions'
import { connect } from 'react-redux'
import { getPosts } from '../actions'
import { HashLoader } from 'react-spinners'
import { Message } from 'semantic-ui-react'

class PostsList extends Component {
    componentDidMount() {
        this.props.getPosts()
    }
    render() {
        const { error } = this.props.posts
        if (error) {
            return (
                <div>
                <HeaderReadable history={this.props.history}/>
                <Message negative className='infoMessage'>
                    <Message.Header>{error}</Message.Header>
                </Message>
                </div>
            )
        }

        const { filters, categories, comments, changes } = this.props
        let posts = this.props.posts.slice().filter(post => post.deleted === false)
        const filteredCategory = this.props.match.params.category
        const filteredPosts = !posts.length || !filteredCategory
            ? posts
            : posts.filter(post => post.category === filteredCategory)
        let validCategory = undefined
        if (filteredCategory) {
            validCategory = categories.find(cat => cat.name === filteredCategory)
        }
        const sortBy = filters.sortByPost
        if (posts.length > 0) {
            switch (sortBy) {
                case 'recent':
                    filteredPosts.sort((prev, curr) => curr.timestamp - prev.timestamp)
                    break
                case 'score':
                filteredPosts.sort((prev, curr) => curr.voteScore - prev.voteScore)
                    break
                default: 
                    break
            }
        }
        return (
            <div>
                <HeaderReadable selected={validCategory} history={this.props.history}/>
                <ListActions />
                { filters.isCreatingPost && !changes.editingPost &&
                    <PostForm />
                }
                { !filteredPosts.length && filteredPosts.length !== 0 && 
                    <div className='loader'>
                        <HashLoader color={'#d8d8d8'} loading={true}/>
                    </div>
                } 
                { filteredPosts.length === 0 && !filters.isCreatingPost &&
                    <Message size='mini' color='teal' className='infoMessage'>No posts created yet! Be the first!</Message>
                }
                { filteredPosts.length > 0 &&
                    <div>
                    { filteredPosts.map(post => {
                        if (filters.isCreatingPost && post.id === changes.editingPost) {
                           return <PostForm key={post.id} />
                        } else
                        return <Post data={post} comments={comments[post.id]} key={post.id}/>
                    })}
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps({ posts, filters, categories, comments, changes }) {
    const postsObj = !posts.error ? Object.values(posts) : { error: posts.error }
    return { posts: postsObj, filters, categories, comments, changes }
}

export default connect(mapStateToProps, { getPosts })(PostsList)