import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ConnectedCommentForm, { CommentForm } from '../components/CommentForm'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store, createStoreWithState, testState } from './mockStore'

const commentData = {
    author: 'thingtwo',
    body: 'Hi there! I am a COMMENT.',
    deleted: false,
    id: '894tuq4ut84ut8v4t8wun89g',
    parentDeleted: false,
    parentId: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1468166872634,
    voteScore: 6
}

const newComment = {
    author: 'newAuthor', 
    body: 'New body!',
    parentId: commentData.parentId
}



describe('CommentForm Component testing', () => {

    const saveCommentFn = jest.fn()
    saveCommentFn.mockReturnValue(Promise.resolve(commentData))
    const setFiltersFn = jest.fn()

    const commentEdit = mount(
        <CommentForm
            comment={commentData}
            parentId={commentData.parentId}
            saveComment={saveCommentFn}
            setFilters={setFiltersFn}
        />
    )

    const commentCreate = mount(
        <CommentForm
            parentId={commentData.parentId}
            saveComment={saveCommentFn}
            setFilters={setFiltersFn}
        />
    )

    const commentCreateThenEdit = mount(
        <CommentForm
            parentId={commentData.parentId}
            saveComment={saveCommentFn}
            setFilters={setFiltersFn}
        />
    )


    it('renders form without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <CommentForm
            comment={commentData}
            saveComment={saveCommentFn}
            setFilters={setFiltersFn}
            store={store}
        />, div);
    })

    it('validates edition form of a Comment', () => {
        expect(toJson(commentEdit.find(CommentForm))).toMatchSnapshot()
    })

    it('validates creation form of a Comment', () => {
        expect(toJson(commentCreate.find(CommentForm))).toMatchSnapshot()
    })

    it('validates creation turning into edition', () => {
        commentCreateThenEdit.setProps({ comment: commentData })
        expect(toJson(commentCreateThenEdit.find(CommentForm))).toMatchSnapshot()
    })

    it('save button is working properly for a new register', () => {
        commentCreate.find('textarea').simulate('change', { target: { value: newComment.body }})
        commentCreate.find('input').simulate('change', { target: { value: newComment.author }})
        commentCreate.find('button').at(0).simulate('click')
        expect(saveCommentFn).toHaveBeenCalledWith(
            {
               author: newComment.author,
               body: newComment.body,
               parentId: newComment.parentId
            })
    })

    it('save button is working properly when editing a register', () => {
        commentCreateThenEdit.setProps({ comment: commentData })
        commentCreateThenEdit.find('textarea').simulate('change', { target: { value: newComment.body }})
        commentCreateThenEdit.find('button').at(0).simulate('click')
  
        expect(saveCommentFn).toHaveBeenLastCalledWith(
            {
               body: newComment.body,
               id: commentData.id,
               parentId: commentData.parentId
            })
    })

    it('cancel button is working properly', () => {
       commentEdit.find('button').at(1).simulate('click')
       expect(setFiltersFn).toHaveBeenCalledWith({ isCreatingComment: false })
    })

    it('validates connected CommentForm', () => {
        const testStore = createStoreWithState({
            ...testState, 
            changes: {
                ...testState.changes,
                editingComment: commentData.id
            }
        })
        const connectedCommentForm = mount(
            <Provider store={testStore}>
                    <ConnectedCommentForm 
                        parentId={commentData.parentId}
                    />
            </Provider>
        )
        expect(toJson(connectedCommentForm.find(ConnectedCommentForm))).toMatchSnapshot()
    })

})
