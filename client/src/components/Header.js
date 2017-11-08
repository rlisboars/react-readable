import React, { Component } from 'react'
import { Menu, Select } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setFilters, getCategories } from '../actions'
import { Link } from 'react-router-dom'

export class Header extends Component {
	componentDidMount() {
		this.props.getCategories()
	}
	componentWillReceiveProps(newProps) {
		if (newProps.selected)
			if (this.props.filters.category !== newProps.selected.name) {
				this.props.setFilters({
					...this.props.filters,
					category: newProps.selected.name
				})
			}
	}
	handleSelectChange(selected) {
		this.props.setFilters({
			...this.props.filters,
			category: selected
		})
		this.props.history.push(`/${selected !== 'All' ? selected : ''}`)
	}
	render() {
		const { categories, disabled, filters } = this.props
		return (
		   <Menu borderless>
			   <Menu.Item>
				   <Link to='/' className='logo'>Leitura</Link>
			   </Menu.Item>
			   <Menu.Item>
				   <span className='category-select-label'>
					   Category:
				   </span>
				   <Select 
						options={
							categories.map((ct, idx) => ({'key': idx, 'value': ct.name, 'text': ct.name }))
						} 
						className='category-select' 
				   		placeholder='Choose a category' 
						disabled={disabled ? true : false} 
						value={filters.category}
						onChange={(evt, data) => this.handleSelectChange(data.value)}/>
			   </Menu.Item>
		   </Menu>
		)
	}
}

function mapStateToProps({ filters, categories }) {
	return { filters, categories }
}

export default connect(mapStateToProps, { setFilters, getCategories })(Header)