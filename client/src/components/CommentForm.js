import React, { Component } from 'react'
import { Segment, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setFilters, saveComment } from '../actions'

export class CommentForm extends Component {
    state = {
        body: '',
        author: ''
    }
    
    handleDisplay() {
        this.props.setFilters({
            ...this.props.filters,
            isCreatingComment: false
        })
    }

    handleFieldChange(field, value) {
        this.setState(currState => ({
            ...currState,
            [field]: value
        }))
    }

    saveComment() {
        const id = this.props.comment ? this.props.comment.id : undefined
        const comment = this.state
        if (!id) 
            this.props.saveComment({
                body: comment.body,
                author: comment.author,
                parentId: this.props.parentId
            }).then(comment => { 
                this.handleDisplay()
            })
        else this.props.saveComment({
            id: id,
            body: comment.body,
            parentId: this.props.parentId
        }).then(comment => {
            this.handleDisplay()
        })
    }

    componentWillMount() {
        const { comment } = this.props
        if (comment) {
            this.setState({
                body: comment.body,
                author: comment.author
            })
        }   
    }

    componentWillReceiveProps({comment}) {
        this.setState({
            body: comment.body,
            author: comment.author
        })
    }

    render() {
        const { comment } = this.props
        return(
            <Segment>
                <Form>
                    <Form.TextArea 
                        label='Body'
                        placeholder='Insert your comment'
                        name='body'
                        value={this.state.body}
                        onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                        required />
                    <Form.Group>
                        <Form.Input 
                            label='Author'
                            placeholder='Your name'
                            width={3}
                            name='author'
                            value={this.state.author}
                            onChange={(_,dt) => this.handleFieldChange(dt.name, dt.value)}
                            disabled={comment ? true : false} 
                            required={!comment ? true: false} />
                        <Form.Field width={9} />
                        <Form.Button className='btn-form' width={2} fluid primary
                            onClick={(e) => { e.preventDefault(); this.saveComment()}}>Save</Form.Button>
                        <Form.Button className='btn-form' width={2} fluid 
                            onClick={(e) => { e.preventDefault(); this.handleDisplay()}}>Cancel</Form.Button>
                    </Form.Group>
                </Form>
            </Segment>
        )
    }
}

function mapStateToProps({ filters, changes, comments }, ownProps) {
    const { editingComment } = changes
    return editingComment 
        ? { filters, comment: comments[ownProps.parentId].find(cmt => cmt.id === editingComment)}
        : { filters, comment: null }
}

export default connect(mapStateToProps, { setFilters, saveComment })(CommentForm)