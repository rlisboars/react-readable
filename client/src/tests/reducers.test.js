import * as actions from '../actions'
import { testState } from './mockStore'
import reducers from '../reducers'
import { createStore } from 'redux'

describe('Reducers testing', () => {

    var store
    const { posts, comments, filters } = testState

    beforeEach(() => {
        store = createStore(reducers)
    })

    it('Initial state check', () => {
        expect(store.getState()).toEqual(
            { filters:
                { category: 'All',
                  sortByPost: 'score',
                  sortByComment: 'score',
                  isCreatingPost: false,
                  isCreatingComment: false },
               categories: [ { name: 'All', path: '' } ],
               posts: {},
               comments: {},
               changes: { editingPost: null, editingComment: null } }
        )
    })

    it('Filters state works properly', () => {
        store.dispatch({ 
            type: actions.SET_FILTERS, 
            filters: { 
                ...filters,
                sortByComment: 'recent'
            }
        })
        expect(store.getState().filters).toEqual(
            { 
                ...filters,
                sortByComment: 'recent'
            }
        )
    })

    it('Categories state works properly', () => {
        const testCategory = { name: 'Test', path: '/test' }
        store.dispatch({
            type: actions.GET_CATEGORIES,
            categories: [testCategory]
        })
        expect(store.getState().categories).toEqual(
            [
                { name: 'All', path: '' },
                testCategory
            ]
        )
    })

    it('Posts state works properly', () => {
        const newPost = {
            id: 'testid1234',
            timestamp: 1467166872634,
            title: 'test post',
            body: 'test post',
            author: 'tester',
            category: 'redux',
            voteScore: 1,
            deleted: false
        }

        //GET_POSTS
        store.dispatch({
            type: actions.GET_POSTS,
            posts
        })
        expect(store.getState().posts).toEqual(
            posts
        )

        //GET_POST
        store.dispatch({
            type: actions.GET_POST,
            post: newPost 
        })
        expect(store.getState().posts).toEqual(
            {
                ...posts,
                [newPost.id]: newPost
            }
        )

        //VOTE_POST
        store.dispatch({
            type: actions.VOTE_POST,
            post: { ...newPost, voteScore: 2 }
        })
        expect(store.getState().posts[newPost.id]).toEqual(
            { ...newPost, voteScore: 2 }
        )

        //SAVE_POST
        store.dispatch({
            type: actions.SAVE_POST,
            post: { ...newPost, body: 'edition test' }
        })
        expect(store.getState().posts[newPost.id]).toEqual({
            ...newPost,
            body: 'edition test'
        })

        //DELETE_POST
        store.dispatch({
            type: actions.DELETE_POST,
            post: { ...newPost, deleted: true }
        })
        expect(store.getState().posts[newPost.id]).toEqual({
            ...newPost,
            deleted: true
        })
    })

    it('Changes state works properly', () => {

        const postId = Object.values(posts)[0].id
        const commentId = Object.values(comments)[0][0].id

        //EDIT_POST
        store.dispatch({
            type: actions.EDIT_POST,
            id: postId
        })
        expect(store.getState().changes).toEqual({
                editingPost: postId,
                editingComment: null,
        })

        //EDIT_COMMENT
        store.dispatch({
            type: actions.EDIT_COMMENT,
            id: commentId
        })
        expect(store.getState().changes).toEqual({
                editingPost: postId,
                editingComment: commentId,
        })
    })

    it('Comments state works properly', () => {
        const newComment = {
                    id: "testid1234",
                    parentId: "8xf0y6ziyjabvozdd253nd",
                    timestamp: 1468166872634,
                    body: "test comment",
                    author: "tester",
                    voteScore: 0,
                    deleted: false,
                    parentDeleted: false,
        }
        //GET_POST_COMMENTS
        store.dispatch({
            type: actions.GET_POST_COMMENTS,
            comments
        })
        expect(store.getState().comments).toEqual(comments)

        //SAVE_COMMENT
        store.dispatch({
            type: actions.VOTE_COMMENT,
            comment: newComment
        })
        expect(store.getState().comments).toEqual({
            ...comments,
            [newComment.parentId]: [
                ...comments[newComment.parentId],
                newComment
            ]
        })

        //VOTE_COMMENT
        store.dispatch({
            type: actions.VOTE_COMMENT,
            comment: {
                ...newComment,
                voteScore: -1
            }
        })
        expect(store.getState().comments).toEqual({
            ...comments,
            [newComment.parentId]: [
                ...comments[newComment.parentId],
                { ...newComment, voteScore: -1 }
            ]
        })

        //VOTE_COMMENT
        store.dispatch({
            type: actions.DELETE_COMMENT,
            comment: {
                ...newComment,
                deleted: true
            }
        })
        expect(store.getState().comments).toEqual({
            ...comments,
            [newComment.parentId]: [
                ...comments[newComment.parentId],
                { ...newComment, deleted: true }
            ]
        })
    })

    it('Errors are being handled properly', () => {
        //GET_CATEGORIES error
        store.dispatch({
            type: actions.GET_CATEGORIES,
            error: 'Error message (GET_CATEGORIES)'
        })
        expect(store.getState().categories).toEqual([ { name: 'All', path: '' } ])

        //GET_POSTS error
        store.dispatch({
            type: actions.GET_POSTS,
            error: 'Error message (GET_POSTS)'
        })
        expect(store.getState().posts).toEqual({ error: 'Error message (GET_POSTS)'})

        //DELETE_POST error
        store.dispatch({
            type: actions.DELETE_POST,
            error: 'Error message (DELETE_POST)'
        })
        expect(store.getState().posts).toEqual({ error: 'Error message (DELETE_POST)'})
    })
})
