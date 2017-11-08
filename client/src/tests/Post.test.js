import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { Post } from '../components/Post'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store } from './mockStore'

const postData = { 
    author: 'thingtwo',
    body: 'Everyone says so after all.',
    category: 'react',
    deleted: false,
    id: "8xf0y6ziyjabvozdd253nd",
    timestamp: 1467166872634,
    title: "Udacity is the best place to learn React",
    voteScore: 6
}
describe('Post Component testing', () => {

    const voteFn = jest.fn()
    const deleteContentFn = jest.fn()
    const editPostFn = jest.fn()

    const postWithDetails = mount(
        <MemoryRouter>
            <Post 
                data={postData} 
                detailed='true' 
                vote={voteFn} 
                editPost={editPostFn} 
                deleteContent={deleteContentFn}/>
        </MemoryRouter>
    )
    const postWithoutDetails = mount(
        <MemoryRouter>
            <Post data={postData} />
        </MemoryRouter>
    )

    const postWithComment = mount(
        <MemoryRouter>
            <Post 
                data={postData} 
                comments={
                    [{
                        author: 'thingtwo',
                        body: 'Hi there! I am a COMMENT.',
                        deleted: false,
                        id: '894tuq4ut84ut8v4t8wun89g',
                        parentDeleted: false,
                        parentId: '8xf0y6ziyjabvozdd253nd',
                        timestamp: 1468166872634,
                        voteScore: 6
                    }]}/>
        </MemoryRouter>
    )

    it('##### renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <MemoryRouter>
                <Post data={postData} store={store}/>
            </MemoryRouter>
        , div);
    })

    it('#### validates snapshot of Post without details', () => {
        expect(toJson(postWithDetails.find(Post))).toMatchSnapshot()
    })

    it('#### validates snapshot of Post with details', () => {
        expect(toJson(postWithoutDetails.find(Post))).toMatchSnapshot()
    })

    it('### validates snapshot of Post with details and coments', () => {
        expect(toJson(postWithComment.find(Post))).toMatchSnapshot()
    })

    it('### vote up and vote down are called properly', () => {
        postWithDetails.find({ icon: 'arrow up' }).simulate('click')
        expect(voteFn).toHaveBeenCalledWith(postData.id, 'POST', 'upVote')
        postWithDetails.find({ icon: 'arrow down' }).simulate('click')
        expect(voteFn).toHaveBeenCalledWith(postData.id, 'POST', 'downVote')
    })

    it('### edit button is working properly', () => {
        postWithDetails.find({ icon: 'write' }).simulate('click')
        expect(editPostFn).toHaveBeenCalledWith(postData.id)
    })

    it('### delete button is working properly', () => {
        postWithDetails.find({ icon: 'trash' }).simulate('click')
        expect(deleteContentFn).toHaveBeenCalledWith(postData.id,'POST')
    })
})
