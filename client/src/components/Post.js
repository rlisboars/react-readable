import React, { Component } from 'react'
import { Menu, Segment, Grid, Header, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { editPost, vote, deleteContent } from '../actions'

export class Post extends Component {
    render() {
        const { data, category } = this.props
        let comments = this.props.comments 
                        ? this.props.comments.slice().filter(cmt => cmt.deleted === false)
                        :[]
        const date = new Date(data.timestamp)
        return (
            <Segment raised className='post'>
                <Grid divided stretched>
                    <Grid.Column width={2} textAlign='center' style={{ 'padding': '0' }}>
                        <Menu fluid vertical text>
                            <Menu.Item>
                                <Button icon='arrow up' 
                                    onClick={() => this.props.vote(data.id, 'POST', 'upVote')}
                                    compact />
                            </Menu.Item>
                            <Menu.Item>
                                <Header as='h4'>{data.voteScore}</Header>
                            </Menu.Item>
                            <Menu.Item>
                                <Button icon='arrow down' 
                                    onClick={() => this.props.vote(data.id, 'POST', 'downVote')}
                                    compact />
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={14}>
                                    <Header as='h3'><Link to={`/${data.category}/${data.id}`}>{data.title}</Link></Header>
                                </Grid.Column>
                                <Grid.Column width={2} style={{ 'paddingLeft': '0px' }}>
                                    <Button.Group size='mini' basic floated='right'>
                                        <Button icon='write' compact
                                            onClick={(evt) => this.props.editPost(data.id)} />
                                        <Button icon='trash' compact
                                            onClick={(evt) => { 
                                                this.props.deleteContent(data.id, 'POST')
                                                if (this.props.history) this.props.history.push(`/${category !== 'All' ? category : ''}`)
                                            }} />
                                    </Button.Group>
                                </Grid.Column>
                            </Grid.Row>
                            { this.props.detailed && 
                                <Grid.Row style={{ 'paddingTop': '0px' }}>
                                    <Grid.Column>
                                        {data.body}
                                    </Grid.Column>
                                </Grid.Row>
                            }
                            <Grid.Row className='post-content-bottom'>
                                <Grid.Column width={12}>
                                    by {data.author} to {data.category} on { date.toLocaleString() }
                            </Grid.Column>
                                <Grid.Column width={4} textAlign='right'>
                                <Link to={`/${data.category}/${data.id}`}>{ comments ? comments.length : '0'} comments</Link>
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}

function mapStateToProps({ filters }) {
    return { category: filters.category }
}

export default connect(mapStateToProps, { editPost, vote, deleteContent })(Post)