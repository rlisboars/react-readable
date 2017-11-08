import React from 'react'
import ReactDOM from  'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ConnectedPostsLists, { PostsList } from '../components/PostsList'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store, errorStore } from './mockStore'

describe('PostsList Component testing', () => {
    const { posts, categories, changes, filters, comments } = store.getState()
    const getPostsFn = jest.fn()
    const postsObj = Object.keys(posts).map(k => posts[k])

    const postsListWithPosts = mount(
        <Provider store={store}>
            <MemoryRouter>
                <PostsList 
                    posts={postsObj}
                    getPosts={getPostsFn}
                    match={{ params: {}}}
                    categories={categories}
                    changes={changes}
                    filters={{ ...filters, sortByPost: 'recent' }}
                    comments={comments}
                />
            </MemoryRouter>
        </Provider>
    )

    const postsListWithoutPosts = mount(
        <Provider store={store}>
            <MemoryRouter>
                <PostsList 
                    posts={[]}
                    getPosts={getPostsFn}
                    match={{ params: {}}}
                    categories={categories}
                    changes={changes}
                    filters={filters}
                    comments={[]}
                />
            </MemoryRouter>
        </Provider>
    )

    const postsListCreatingPost = mount(
        <Provider store={store}>
        <MemoryRouter>
            <PostsList 
                posts={[]}
                getPosts={getPostsFn}
                match={{ params: {}}}
                categories={categories}
                changes={changes}
                filters={{...filters, isCreatingPost: true }}
                comments={[]}
            />
        </MemoryRouter>
    </Provider>
    )

    const postsListEditingPost = mount(
        <Provider store={store}>
        <MemoryRouter>
            <PostsList 
                posts={postsObj}
                getPosts={getPostsFn}
                match={{ params: { category: 'react' }}}
                categories={categories}
                changes={{...changes, editingPost: '8xf0y6ziyjabvozdd253nd'}}
                filters={{...filters, category: 'react', isCreatingPost: true }}
                comments={[]}
            />
        </MemoryRouter>
    </Provider>
    )

    const postsListConnectionError = mount(
        <Provider store={store}>
        <MemoryRouter>
            <PostsList 
                posts={{error: 'Message error'}}
                getPosts={getPostsFn}
                match={{ params: {}}}
                categories={categories}
                changes={changes}
                filters={filters}
                comments={[]}
            />
        </MemoryRouter>
    </Provider>
    )

    it('renders PostLists without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <MemoryRouter>
                    <PostsList 
                        posts={postsObj}
                        getPosts={getPostsFn}
                        match={{ params: {}}}
                        categories={categories}
                        changes={changes}
                        filters={filters}
                        comments={comments}
                    />
                </MemoryRouter>
            </Provider>, div);
    })
    

    it('snpashot of PostsList with posts', () => {
        expect(toJson(postsListWithPosts.find(PostsList))).toMatchSnapshot()
    })

    it('snpashot of PostsList without posts', () => {
        expect(toJson(postsListWithoutPosts.find(PostsList))).toMatchSnapshot()
    })

    it('snapshot of Post creation in PostsList', () => {
        expect(toJson(postsListCreatingPost.find(PostsList))).toMatchSnapshot()
    })

    it('snapshot of Post editing in PostsList', () => {
        expect(toJson(postsListEditingPost.find(PostsList))).toMatchSnapshot()
    })

    it('snapshot connection error in PostsList', () => {
        expect(toJson(postsListConnectionError.find(PostsList))).toMatchSnapshot()
    })

    it('snapshot of connected PostsList', () => {
        const connectedPostsLists = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ConnectedPostsLists 
                        match={{ params: { category: 'react' }}}
                    />
                </MemoryRouter>
            </Provider>
        )
        expect(toJson(connectedPostsLists.find(ConnectedPostsLists))).toMatchSnapshot()
    })

    it('snapshot of connected PostLists with connection error', () => {
        const connectedPostsListsError = mount(
            <Provider store={errorStore}>
                <MemoryRouter>
                    <ConnectedPostsLists 
                        match={{ params: { category: 'react' }}}
                    />
                </MemoryRouter>
            </Provider>
        )
        expect(toJson(connectedPostsListsError.find(ConnectedPostsLists))).toMatchSnapshot()
    })


})