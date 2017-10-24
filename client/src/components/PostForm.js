import React, { Component } from 'react'
import { Segment, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setFilters, savePost, getPost } from '../actions'

export class PostForm extends Component {
    state = {
        title: '',
        body: '',
        author: '',
        category: this.props.filters.category === 'All' ? '' : this.props.filters.category
    }
    handleDisplay() {
        this.props.setFilters({
            ...this.props.filters,
            isCreatingPost: false
        })
    }
    handleFieldChange(field, value) {
        this.setState(currState => ({
            ...currState,
            [field]: value
        }))
    }
    savePost() {
        const id = this.props.post ? this.props.post.id : undefined
        const post = this.state
        if (!id) 
            this.props.savePost({
                timestamp: Date.now(),
                title: post.title,
                body: post.body,
                author: post.author,
                category: post.category
            }).then(post => { 
                this.props.getPost(post.post.id)
                this.handleDisplay()
            })
        else this.props.savePost({
            id: id,
            title: post.title,
            body: post.body
        }).then(post => {
            this.props.getPost(post.post.id)
            this.handleDisplay()
        })
    }
    componentWillMount() {
        const { post } = this.props
        if (post) {
            this.setState({
                title: post.title,
                body: post.body,
                author: post.author,
                category: post.category
            })
        }
    }

    componentWillReceiveProps({post}) {
        if (post) {
            this.setState({
                title: post.title,
                body: post.body,
                author: post.author,
                category: post.category
            })
        }
    }

    render() {
        const categories = this.props.categories.slice(1);
        const { post } = this.props
        return (
            <Segment raised>
                <Form>
                    <Form.Input 
                        label='Title'
                        placeholder='Post Title' 
                        name='title'
                        value={this.state.title} 
                        onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                        required/>
                    <Form.TextArea 
                        label='Body'
                        placeholder='Post Content'
                        name='body'
                        value={this.state.body}
                        onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                        required />
                    <Form.Group>
                        <Form.Input 
                            label='Author' 
                            placeholder='Your name' 
                            width={3} name='author' 
                            value={this.state.author} 
                            onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                            disabled={post ? true : false} 
                            required={!post ? true: false} />
                        <Form.Select 
                            label='Category' 
                            options={
                                categories.map((ct, idx) => ({'key': idx, 'value': ct.name, 'text': ct.name }))
                            }
                            className='category-select'
                            placeholder='Select a category'
                            name='category'
                            value={this.state.category}
                            onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                            disabled={post ? true : false} 
                            required={!post ? true: false} />
                        <Form.Button className='btn-form' width={2} fluid primary
                            onClick={(e) => { e.preventDefault(); this.savePost() }}>Save</Form.Button>
                    <Form.Button className='btn-form' width={2} fluid onClick={(e) => { e.preventDefault(); this.handleDisplay()}}>Cancel</Form.Button>
                    </Form.Group>
                </Form>
            </Segment>
        )
    }
}

function mapStateToProps({posts, changes, categories, filters}) {
    const { editingPost } = changes 
    return editingPost ? { categories, post: posts[editingPost], filters } :  { categories , post: null, filters }
}

export default connect(mapStateToProps, { setFilters, savePost, getPost })(PostForm)