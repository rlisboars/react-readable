import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { CommentForm } from '../components/CommentForm'
import { configure, mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store } from './mockStore'

configure({ adapter: new Adapter() })

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



describe('CommentForm Component testing', () => {

    const saveCommentFn = jest.fn()
    saveCommentFn.mockReturnValueOnce(Promise.resolve(commentData))
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


    it('##### renders form without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <CommentForm
            comment={commentData}
            saveComment={saveCommentFn}
            setFilters={setFiltersFn}
            store={store}
        />, div);
    })

    it('#### validates edition form of a Comment', () => {
        expect(toJson(commentEdit.find(CommentForm))).toMatchSnapshot()
    })

    it('#### validates creation form of a Comment', () => {
        expect(toJson(commentCreate.find(CommentForm))).toMatchSnapshot()
    })

    it('### save button is working properly', () => {
        commentEdit.find('button').at(0).simulate('click')
        expect(saveCommentFn).toHaveBeenCalledWith(
            {
                id: commentData.id,
                body: commentData.body,
                parentId: commentData.parentId
            })
    })

    it('### cancel button is working properly', () => {
       commentCreate.find('button').at(1).simulate('click')
       expect(setFiltersFn).toHaveBeenCalledWith({ isCreatingComment: false })
    })

})
