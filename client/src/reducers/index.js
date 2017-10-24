import { combineReducers } from 'redux'
import { SET_FILTERS, GET_CATEGORIES,
         GET_POST, EDIT_POST, VOTE_POST, GET_POSTS, SAVE_POST, DELETE_POST,
         GET_POST_COMMENTS, EDIT_COMMENT, SAVE_COMMENT, DELETE_COMMENT, VOTE_COMMENT} from '../actions'

const initialFilterState = {
    category: 'All',
    sortByPost: 'score',
    sortByComment: 'score',
    isCreatingPost: false,
    isCreatingComment: false
}

function filters (state = initialFilterState, action) {
    switch (action.type) {
        case SET_FILTERS: 
            return action.filters
        default:
            return state
    }
}

const initialCategoryState = [{ name: 'All', path: '' }]

function categories (state = initialCategoryState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            if (action.error) return initialCategoryState
            return [
                { name: 'All', path: '' },
                ...action.categories
            ]
        default:
            return state
    }
}

function posts (state = {}, action) {
    switch (action.type) {
        case GET_POSTS:
            if (action.error) return { error: action.error }
            return action.posts
        case GET_POST: 
        case VOTE_POST:
        case SAVE_POST:
        case DELETE_POST:
            if (action.error)  return { error: action.error }
            return {
                ...state,
                [action.post.id]: action.post
            }
        default:
            return state
    }
}

const initialChangesState = {
    editingPost: null,
    editingComment: null
}
function changes (state = initialChangesState, action) {
    switch (action.type) { 
        case EDIT_POST:
        return {
            ...state,
            editingPost: action.id
        }
        case EDIT_COMMENT:
        return {
            ...state,
            editingComment: action.id
        }
        default:
            return state
    }
}

function comments (state = {}, action) {
    switch (action.type) {
        case GET_POST_COMMENTS:
            const key = Object.keys(action.comments)[0]
            return {
                ...state,
                [key]: action.comments[key]
            }
        case VOTE_COMMENT:
        case SAVE_COMMENT:
        case DELETE_COMMENT:  
            const { comment } = action
            let comments = state[comment.parentId] 
                           ? state[comment.parentId].slice().filter(cmt => cmt.id !== comment.id)
                           : []
            comments.push(comment)
            return {
                ...state,
                [comment.parentId]: comments
            }
        default:
            return state
    }
}

export default combineReducers({
    filters,
    categories,
    posts,
    comments,
    changes
})