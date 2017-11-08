import * as actions from '../actions'
import fetchMock from 'fetch-mock'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { testState } from './mockStore'

const URL = process.env.REACT_APP_URL
const headers = { 'content-type': 'application/json' }
const state = testState

describe('Actions testing', () => {
    
    var store
    const posts = Object.values(state.posts)
    const comments = state.comments[posts[0].id]

    beforeEach(() => {
        store = configureStore([thunk])(state)
    })

    afterEach(() => {
        fetchMock.reset()
        fetchMock.restore()
    })
    
    it('setFilters action works properly', () => {
        store.dispatch(actions.setFilters({ ...state.filters, category: 'react' }))
        return expect(store.getActions()).toEqual(
            [{
                type: actions.SET_FILTERS,
                filters: {
                    ...state.filters,
                    category: 'react'
                }
            }]
        )
    })

    it('getCategories action works properly', () => {
        fetchMock.getOnce(
            `${URL}/categories`, 
            { body: { categories: state.categories }, headers })
        return store.dispatch(actions.getCategories()).then(() => {
            expect(store.getActions()).toEqual(
                [{
                    type: actions.GET_CATEGORIES,
                    categories: state.categories
                }]
            )
        }) 
    })

    it('getPosts actions works properly', () => {
        fetchMock.getOnce(`${URL}/redux/posts`, { body: posts, headers })
        fetchMock.getOnce(`${URL}/posts/${posts[0].id}/comments`, { body: Object.values(state.comments), headers })
        fetchMock.getOnce(`${URL}/posts/${posts[1].id}/comments`, { body: [], headers })

        // with category
        return store.dispatch(actions.getPosts('redux')).then(() => {
            expect(store.getActions()).toEqual(
                [{
                    type: actions.GET_POSTS,
                    posts: state.posts
                }]
            )

            // without category
            fetchMock.getOnce(`${URL}/posts`, { body: posts, headers })
            fetchMock.getOnce(`${URL}/posts/${posts[0].id}/comments`, { body: Object.values(state.comments), headers })
            fetchMock.getOnce(`${URL}/posts/${posts[1].id}/comments`, { body: [], headers })
            return store.dispatch(actions.getPosts()).then(() => {
                expect(store.getActions()[3]).toEqual(
                    { type: actions.GET_POSTS,
                        posts: state.posts
                    }
                )
            })
        })
    })

    it('getPosts connection error is shown', () => {
        return store.dispatch(actions.getPosts()).then(() => {
            expect(store.getActions()).toEqual(
                [ { type: actions.GET_POSTS, error: 'Error contacting server' } ]
            )
        })
    })

    it('getPost action works properly', () => {
        fetchMock.getOnce(`${URL}/posts/${posts[0].id}`, { body: posts[0], headers })
        fetchMock.getOnce(`${URL}/posts/${posts[0].id}/comments`, { body: Object.values(state.comments), headers })
        return store.dispatch(actions.getPost(posts[0].id)).then(() => {
            expect(store.getActions()).toEqual(
                [{
                    type: actions.GET_POST,
                    post: posts[0]
                }]
            )
        })
    })

    it('editPost action works properly', () => {
        store.dispatch(actions.editPost(posts[0].id))
        return expect(store.getActions()).toEqual(
            [{ type: actions.EDIT_POST, id: '8xf0y6ziyjabvozdd253nd' }]
        )
    })

    it('savePost (edition and creation) action works properly', () => {
        // edition
        fetchMock.putOnce(
            `${URL}/posts/${posts[0].id}`,
            { body: posts[0], headers })
        
        return store.dispatch(actions.savePost(posts[0])).then(() => {
            expect(store.getActions()).toEqual(
                [{ type: actions.SAVE_POST, post: posts[0] }]
            )

            // creation
            fetchMock.postOnce(
                `${URL}/posts`,
                { body: posts[1], headers })

            return store.dispatch(actions.savePost({ ...posts[1], id: null })).then(() => {
                expect(store.getActions()[1]).toEqual(
                    { type: actions.SAVE_POST, post: posts[1] }
                )
            })
        })
    })

    it('savePost connection error is shown', () => {
        return store.dispatch(actions.savePost(posts[0])).then(() => {
            expect(store.getActions()).toEqual(
                [ { type: actions.SAVE_POST, error: 'Error contacting server' } ]
            )
        })
    })

    it('saveComment (edition and creation) action works properly', () => {
        // edition
        fetchMock.putOnce(
            `${URL}/comments/${comments[0].id}`,
            { body: comments[0], headers })
        
        return store.dispatch(actions.saveComment(comments[0])).then(() => {
            expect(store.getActions()).toEqual(
                [{ type: actions.SAVE_COMMENT, comment: comments[0] }]
            )
            // creation
            fetchMock.postOnce(
                `${URL}/comments`,
                { body: comments[1], headers })

            return store.dispatch(actions.saveComment({ ...comments[1], id: null })).then(() => {
                expect(store.getActions()[1]).toEqual(
                    { type: actions.SAVE_COMMENT, comment: comments[1] }
                )
            })
        })
    })

    it('saveComment connection error is shown', () => {
        return store.dispatch(actions.saveComment(comments[0])).then(() => {
            expect(store.getActions()).toEqual(
                [ { type: actions.SAVE_COMMENT, error: 'Error contacting server' } ]
            )
        })
    })

    it('editComment action works properly', () => {
        store.dispatch(actions.editComment(comments[0].id))
        return expect(store.getActions()).toEqual(
            [{ type: actions.EDIT_COMMENT, id: comments[0].id }]
        )
    })

    it('deleteContent (post and comment) action works properly', () => {
        fetchMock.deleteOnce(
            `${URL}/posts/${posts[0].id}`,
            { body: posts[0], headers }
        )

        fetchMock.deleteOnce(
            `${URL}/comments/${comments[0].id}`,
            { body: comments[0], headers }
        )

        return store.dispatch(actions.deleteContent(posts[0].id, 'POST')).then(() => {
            expect(store.getActions()).toEqual(
                [{ type: actions.DELETE_POST, post: posts[0] }]
            )

            return store.dispatch(actions.deleteContent(comments[0].id, 'COMMENT')).then(() => {
                expect(store.getActions()[1]).toEqual(
                    { type: actions.DELETE_COMMENT, comment: comments[0] }
                )
            })
        })
    })

    it('vote (post and comment) action works properly', () => {
        fetchMock.postOnce(
            `${URL}/posts/${posts[0].id}`,
            { body: posts[0], headers }
        )

        fetchMock.postOnce(
            `${URL}/comments/${comments[0].id}`,
            { body: comments[0], headers }
        )

        return store.dispatch(actions.vote(posts[0].id, 'POST', 'upVote')).then(() => {
            expect(store.getActions()).toEqual(
                [{ type: actions.VOTE_POST, post: posts[0] }]
            )

            return store.dispatch(actions.vote(comments[0].id, 'COMMENT', 'downVote')).then(() => {
                expect(store.getActions()[1]).toEqual(
                    { type: actions.VOTE_COMMENT, comment: comments[0] }
                )
            })
        })
    })

    it('vote connection error is shown', () => {
        return store.dispatch(actions.vote(posts[0].id, 'POST', 'upVote')).then(() => {
            expect(store.getActions()).toEqual(
                [ { type: actions.VOTE_POST, error: 'Error contacting server' } ]
            )
        })
    })

})
