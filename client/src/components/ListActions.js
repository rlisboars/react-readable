import React, { Component } from 'react'
import { Menu, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setFilters } from '../actions'

class ListActions extends Component {
    
    setSort(option, content) {
        this.props.setFilters({
            ...this.props.filters,
            ['sortBy' + content]: option
        })
    }

    isCreatingContent(content) {
        const isCreating = 'isCreating'+content
        if (!this.props.filters[isCreating])
            this.props.setFilters({
                ...this.props.filters,
                [isCreating]: true
            })
    }

    render() {
        const type = this.props.comment ? 'Comment' : 'Post'
        const { filters } = this.props
        return(
            <Menu className='sub-menu' secondary>
                <Menu.Item header>Sort By:</Menu.Item>
                <Menu.Item name='score' active={filters['sortBy'+type] === 'score'} onClick={(_, data) => this.setSort(data.name, type)}>High Score</Menu.Item>
                <Menu.Item name='recent' active={filters['sortBy'+type] === 'recent'} onClick={(_, data) => this.setSort(data.name, type)}>Most Recent</Menu.Item>
                <Menu.Item position='right'>
                    <Button content={`Create ${type}`} icon='plus' labelPosition='left' onClick={() => this.isCreatingContent(type)} />
                </Menu.Item>
            </Menu>
        )
    }
}

function mapStateToProps({ filters }) {
    return { filters }
}

export default connect(mapStateToProps, { setFilters })(ListActions)