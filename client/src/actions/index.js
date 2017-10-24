import {
    fetchCategories, fetchPost, fetchPosts, savePost as savePostAPI,
    fetchPostComments, voteOn, saveComment as saveCommentAPI,
    deleteContent as deleteContentAPI
} from '../utils/api'

export const SET_FILTERS = 'SET_FILTERS'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const GET_POST = 'GET_POST'
export const EDIT_POST = 'EDIT_POST'
export const VOTE_POST = 'VOTE_POST'
export const GET_POSTS = 'GET_POSTS'
export const SAVE_POST = 'SAVE_POST'
export const DELETE_POST = 'DELETE_POST'
export const GET_POSTS_FAILURE = 'GET_POSTS_FAILURE'
export const GET_POST_COMMENTS = 'GET_POST_COMMENTS'
export const VOTE_COMMENT = 'VOTE_COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const SAVE_COMMENT = 'SAVE_COMMENT'
export const UPDATE_COMMENTS_QTTY = 'UPDATE_COMMENTS_QTTY'

export function setFilters(filters) {
    return function (dispatch, getState) {
        Promise.resolve(
            dispatch(({
                type: SET_FILTERS,
                filters: {
                    ...filters
                }
            }))
        ).then(() => {
            if (!getState().filters.isCreatingPost)
                dispatch(({
                    type: EDIT_POST,
                    id: null
                }))
            if (!getState().filters.isCreatingComment)
                dispatch(({
                    type: EDIT_COMMENT,
                    id: null
                }))
        })
    }
}

export function getCategories() {
    return function (dispatch) {
        return fetchCategories().then(
            categories => dispatch(({
                type: GET_CATEGORIES,
                categories: categories
            }))
        ).catch(error => dispatch(({
            type: GET_CATEGORIES,
            error: error
        })))
    }
}

export function getPosts(category = undefined) {
    return function (dispatch, getState) {
        return fetchPosts(category)
            .then(posts => {
                return dispatch(({
                    type: GET_POSTS,
                    posts: posts.reduce((postsObj, post) => ({
                        ...postsObj,
                        [post.id]: post
                    }), {})
                }))
            }).then(() => {
                const { posts } = getState()
                Object.keys(posts).map(postId => {
                    return getPostComments(dispatch, postId)
                })
            }).catch(error => (
                dispatch(({
                    type: GET_POSTS,
                    error: 'Error contacting server'
                }))
            ))
    }
}

export function getPost(postId) {
    return function (dispatch) {
        return fetchPost(postId)
            .then(post => {
                return dispatch(({
                    type: GET_POST,
                    post: post
                }))
            })
            .then(() => {
                getPostComments(dispatch, postId)
            })
            .catch(error =>
                dispatch(({
                    type: GET_POST,
                    error: 'Error contacting server'
                }))
            )
    }
}

export function editPost(postId) {
    return function (dispatch, getState) {
        Promise.resolve(dispatch(({
            type: EDIT_POST,
            id: postId
        })))
            .then(() => {
                const filters = {
                    ...getState().filters,
                    isCreatingPost: true
                }
                return dispatch(({
                    type: SET_FILTERS,
                    filters
                }))
            })
    }
}

export function savePost(post) {
    return function (dispatch) {
        return savePostAPI(post).then(
            post =>
                dispatch(({
                    type: SAVE_POST,
                    post
                }))
        ).catch(error =>
            dispatch(({
                type: SAVE_POST,
                error: 'Error contacting server'
            })))
    }
}

export function saveComment(comment) {
    return function (dispatch) {
        return saveCommentAPI(comment).then(
            comment => dispatch(({
                type: SAVE_COMMENT,
                comment
            }))
        ).catch(error => {
            console.log(error)
            dispatch(({
            type: SAVE_COMMENT,
            error: 'Error contacting server'
        }))})
    }
}

export function deleteContent(id, type) {
    return function (dispatch) {
        return deleteContentAPI(id, type).then(
            content => {
                return type === 'COMMENT'
                    ? dispatch(({
                        type: DELETE_COMMENT,
                        comment: content
                    }))
                    : dispatch(({
                        type: DELETE_POST,
                        post: content
                    }))
            }
        )
    }
}

export function vote(id, type, vote) {
    return function (dispatch) {
        return voteOn(id, type, vote)
            .then(content => {
                return type === 'COMMENT'
                    ? dispatch(({
                        type: VOTE_COMMENT,
                        comment: content
                    }))
                    : dispatch(({
                        type: VOTE_POST,
                        post: content
                    }))
            })
            .catch(error => dispatch(({
                type: VOTE_POST,
                error: 'Error contacting server'
            })))
    }
}

export function editComment(postId, commentId) {
    return function (dispatch, getState) {
        Promise.resolve(dispatch(({
            type: EDIT_COMMENT,
            id: commentId
        })))
            .then(() => {
                const filters = {
                    ...getState().filters,
                    isCreatingComment: true
                }
                return dispatch(({
                    type: SET_FILTERS,
                    filters
                }))
            })
    }
}

function getPostComments(dispatch, postId) {
    return fetchPostComments(postId).then(cmts => {
        const comments = cmts.filter(c => c.deleted === false)
        const commentsQtty = comments.length
        const commentsObj = commentsQtty > 0
            ? { [comments[0].parentId]: comments }
            : {}
        dispatch(({
            type: GET_POST_COMMENTS,
            comments: commentsObj
        }))
    })
}