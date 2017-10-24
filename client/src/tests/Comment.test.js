import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { Comment } from '../components/Comment'
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

describe('Comment Component testing', () => {

    const voteFn = jest.fn()
    const deleteContentFn = jest.fn()
    const editCommentFn = jest.fn()

    const comment = mount(
        <Comment 
            data={commentData} 
            vote={voteFn} 
            editComment={editCommentFn} 
            deleteContent={deleteContentFn}
        />
    )


    it('##### renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <Comment 
            data={commentData} 
            vote={voteFn} 
            editComment={editCommentFn} 
            deleteContent={deleteContentFn}
        />, div);
    })

    it('#### validates snapshot of a Comment', () => {
        expect(toJson(comment.find(Comment))).toMatchSnapshot()
    })

    it('### vote up and vote down are called properly', () => {
        comment.find({ icon: 'arrow up' }).simulate('click')
        expect(voteFn).toHaveBeenCalledWith(commentData.id, 'COMMENT', 'upVote')
        comment.find({ icon: 'arrow down' }).simulate('click')
        expect(voteFn).toHaveBeenCalledWith(commentData.id, 'COMMENT', 'downVote')
    })

    it('### edit button is working properly', () => {
        comment.find({ icon: 'write' }).simulate('click')
        expect(editCommentFn).toHaveBeenCalledWith(commentData.parentId, commentData.id)
    })

    it('### delete button is working properly', () => {
        comment.find({ icon: 'trash' }).simulate('click')
        expect(deleteContentFn).toHaveBeenCalledWith(commentData.id,'COMMENT')
    })

})
