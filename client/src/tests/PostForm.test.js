import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { PostForm } from '../components/PostForm'
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

const newPostData = {
    author: 'New user',
    body: 'Testing change on body',
    category: 'redux',
    title: 'Testing change on title'
}

describe('PostForm Component testing', () => {

    const savePostFn = jest.fn()
    savePostFn.mockReturnValue(Promise.resolve({ post: postData }))
    const setFiltersFn = jest.fn()
    const getPostFn = jest.fn()
    getPostFn.mockReturnValueOnce(Promise.resolve({ post: postData }))
    
    const postEdit = mount(
        <PostForm
            post={postData}
            savePost={savePostFn}
            getPost={getPostFn}
            setFilters={setFiltersFn}
            categories={store.getState().categories}
            filters={store.getState().filters}
        />
    )

    const postCreate = mount(
        <PostForm
            savePost={savePostFn}
            getPost={getPostFn}
            setFilters={setFiltersFn}
            categories={store.getState().categories}
            filters={{...store.getState().filters, category: 'react'}}
        />
    )

    const postCreateThenEdit = mount(
        <PostForm
            savePost={savePostFn}
            getPost={getPostFn}
            setFilters={setFiltersFn}
            categories={store.getState().categories}
            filters={{...store.getState().filters, category: 'react'}}
        />
    )


    it('renders form without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
        <PostForm
            post={postData}
            savePost={savePostFn}
            setFilters={setFiltersFn}
            filters={store.getState().filters}
            categories={store.getState().categories}
        />, div);
    })

    it('validates edition form of a Post', () => {
        expect(toJson(postEdit.find(PostForm))).toMatchSnapshot()
    })

    it('validates creation form of a Comment', () => {
        expect(toJson(postCreate.find(PostForm))).toMatchSnapshot()
    })

    it('validates creation turning into edition', () => {
        postCreateThenEdit.setProps({ post: postData })
        expect(toJson(postCreateThenEdit.find(PostForm))).toMatchSnapshot()
    })

    it('save button is working properly for a new register', () => {
        postCreate.find('input').at(0).simulate('change', { target: { value: newPostData.title }})
        postCreate.find('textarea').simulate('change', { target: { value: newPostData.body }})
        postCreate.find('input').at(1).simulate('change', { target: { value: newPostData.author }})
        postCreate.find('DropdownItem').at(1).simulate('click')
        postCreate.find('button').at(0).simulate('click')
        const timestmp = savePostFn.mock.calls[0][0].timestamp
        expect(savePostFn).toHaveBeenCalledWith({...newPostData, timestamp: timestmp})
    })

    it('save button is working properly when editing register', () => {
        postEdit.find('input').at(0).simulate('change', { target: { value: newPostData.title }})
        postEdit.find('textarea').simulate('change', { target: { value: newPostData.body }})
        postEdit.find('button').at(0).simulate('click')
        const timestmp = savePostFn.mock.calls[0][0].timestamp
        expect(savePostFn).toHaveBeenCalledWith({...newPostData, timestamp: timestmp})
    })

    it('cancel button is working properly', () => {
       postEdit.find('button').at(1).simulate('click')
       expect(setFiltersFn).toHaveBeenCalledWith(store.getState().filters)
    })

})
