import React from 'react'
import ReactDOM from  'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ConnectedCommentsList, { CommentsList } from '../components/CommentsList'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { store, errorStore } from './mockStore'
import { getPost } from '../actions'

describe('CommentsList Component testing', () => {
    const { posts, cateogories, changes, filters, comments } = store.getState()
    const getPostFn = jest.fn()
    const postWithComments = posts['8xf0y6ziyjabvozdd253nd']
    const postWithoutComments = posts['6ni6ok3ym7mf1p33lnez']

    const commentsListWithComments = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={postWithComments}
                    getPost={getPostFn}
                    match={{ params: { id: postWithComments.id }}}
                    changes={changes}
                    filters={{ ...filters, sortByComment: 'recent' }}
                    postComments={comments["8xf0y6ziyjabvozdd253nd"]}
                />
             </MemoryRouter>
         </Provider>
    )

    const commentsListWithoutComments = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={postWithoutComments}
                    getPost={getPostFn}
                    match={{ params: { id: postWithoutComments.id }}}
                    changes={changes}
                    filters={filters}
                    postComments={[]}
                />
             </MemoryRouter>
         </Provider>
    )

    const commentsListCreatingComment = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={postWithoutComments}
                    getPost={getPostFn}
                    match={{ params: { id: postWithoutComments.id }}}
                    changes={changes}
                    filters={{ ...filters, isCreatingComment: true }}
                    postComments={[]}
                />
             </MemoryRouter>
         </Provider>
    )

    const commentsListEditingComments = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={postWithComments}
                    getPost={getPostFn}
                    match={{ params: { id: postWithComments.id }}}
                    changes={{ ...changes, editingComment: '894tuq4ut84ut8v4t8wun89g' }}
                    filters={{ ...filters, category: 'react', isCreatingComment: true }}
                    postComments={comments["8xf0y6ziyjabvozdd253nd"]}
                />
             </MemoryRouter>
         </Provider>
    )

    const commentsListEditingPost = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={postWithComments}
                    getPost={getPostFn}
                    match={{ params: { id: postWithComments.id }}}
                    changes={{ ...changes, editingPost: '8xf0y6ziyjabvozdd253nd' }}
                    filters={{ ...filters, category: 'react', isCreatingPost: true }}
                    postComments={comments['8xf0y6ziyjabvozdd253nd']}
                />
            </MemoryRouter>
        </Provider>
    )

    const commentsListWithConnectionError = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={{error: 'Error message'}}
                    getPost={getPostFn}
                    match={{ params: { id: postWithoutComments.id }}}
                    changes={changes}
                    filters={filters}
                    postComments={undefined}
                />
             </MemoryRouter>
         </Provider>
    )

    const commentsListWrongId = mount(
        <Provider store={store}>
            <MemoryRouter>
                <CommentsList 
                    post={undefined}
                    getPost={getPostFn}
                    match={{ params: { id: 'abc' }}}
                    changes={changes}
                    filters={filters}
                    postComments={[]}
                />
             </MemoryRouter>
         </Provider>
    )

    it('renders CommentsList without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <MemoryRouter>
                    <CommentsList 
                        post={postWithComments}
                        getPost={getPostFn}
                        match={{ params: { id: postWithComments.id }}}
                        changes={changes}
                        filters={filters}
                        postComments={comments["8xf0y6ziyjabvozdd253nd"]}
                    />
                </MemoryRouter>
            </Provider>, div);
    })
    
    it('snpashot of CommentsList with comments', () => {
        expect(toJson(commentsListWithComments.find(CommentsList))).toMatchSnapshot()
    })

    it('snpashot of CommentsList without comments', () => {
        expect(toJson(commentsListWithoutComments.find(CommentsList))).toMatchSnapshot()
    })
 
    it('snpashot of CommentsList creating a comment', () => {
        expect(toJson(commentsListCreatingComment.find(CommentsList))).toMatchSnapshot()
    })

    it('snpashot of CommentsList editing a comment', () => {
        expect(toJson(commentsListEditingComments.find(CommentsList))).toMatchSnapshot()
    }
)
    it('snpashot of CommentsList editing a post', () => {
        expect(toJson(commentsListEditingPost.find(CommentsList))).toMatchSnapshot()
    })

    it('snpashot of CommentsList with connection error', () => {
        expect(toJson(commentsListWithConnectionError.find(CommentsList))).toMatchSnapshot()
    })

    it('snpashot of CommentsList with invalid post id', () => {
        expect(toJson(commentsListWrongId.find(CommentsList))).toMatchSnapshot()
    })

    it('snapshot of connected CommentsList', () => {
        const connectedCommentsList = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ConnectedCommentsList 
                        match={{ params: { id: postWithComments.id }}}
                    />
                </MemoryRouter>
            </Provider>
        )
        expect(toJson(connectedCommentsList.find(ConnectedCommentsList))).toMatchSnapshot()
    })

    it('snapshot of connected CommentsList with connectionError', () => {
        const connectedCommentsListWithError = mount(
            <Provider store={errorStore}>
                <MemoryRouter>
                    <ConnectedCommentsList 
                        match={{ params: { id: postWithComments.id }}}
                    />
                </MemoryRouter>
            </Provider>
        )
        expect(toJson(connectedCommentsListWithError.find(ConnectedCommentsList))).toMatchSnapshot()
    })

})