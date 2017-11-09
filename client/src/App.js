import React, { Component } from 'react'
import PostsList from './components/PostsList'
import CommentsList from './components/CommentsList'
import { Route, Switch } from 'react-router-dom'
 
export class App extends Component {

	render() {
		return (
			<div className="App">
				<Switch>
				<Route path='/' exact component={PostsList} />
				<Route path='/:category/:id' component={CommentsList} />
				<Route path='/:category' component={PostsList} />
				</Switch>
				<footer>
					<div className='spacer' />
					<div className='footer'>
						by <a href="https://github.com/rlisboars/" target="_blank" rel="noopener noreferrer" style={{'marginBottom': '0px'}}>rlisboars</a>
					</div>
				</footer>
			</div>
		);
	}
}

export default App;
