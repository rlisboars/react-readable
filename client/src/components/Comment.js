import React, { Component } from 'react'
import { Segment, Grid, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { editComment, deleteContent, vote } from '../actions'

export class Comment extends Component {
    render() {
        const { data } = this.props
        const date = new Date(data.timestamp)
        return (
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={15}>
                            <span className='comment-user'>{data.author}</span>
                            <span className='comment-date'>{date.toLocaleString()}</span>
                        </Grid.Column>
                        <Grid.Column width={1}>
                            <Button.Group size='mini' basic floated='right'>
                                <Button icon='write' 
                                    onClick={(evt) => this.props.editComment(data.parentId, data.id)}
                                    compact />
                                <Button icon='trash' 
                                    onClick={(evt) => this.props.deleteContent(data.id, 'COMMENT')} 
                                    compact />
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='comment-content'>
                        <Grid.Column>
                        {data.body}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='comment-content'>
                        <Grid.Column>
                            <Button 
                                icon='arrow up' 
                                size='mini' 
                                basic
                                style={{'marginRight':'0px'}} 
                                compact 
                                onClick={() => this.props.vote(data.id, 'COMMENT', 'upVote')}/>
                            <span className='comment-score'>{data.voteScore}</span>
                            <Button 
                                icon='arrow down' 
                                size='mini' 
                                basic 
                                compact
                                onClick={() => this.props.vote(data.id, 'COMMENT', 'downVote')}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

export default connect(null, { editComment, deleteContent, vote })(Comment)