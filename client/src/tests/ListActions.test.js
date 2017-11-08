import React from 'react'
import ReactDOM from  'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { ListActions } from '../components/ListActions'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store } from './mockStore'

describe('ListActions Component testing', () => {
    const setFiltersFn = jest.fn()

    const listActionsPost = mount(
            <ListActions 
                filters={store.getState().filters}
                setFilters={setFiltersFn}
            />
    )

    const listActionsComment = mount(
        <ListActions 
            filters={{...store.getState().filter, sortByComment: 'recent'}}
            setFilters={setFiltersFn}
            comment
        />
    )

    it('##### renders ListAction without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <ListActions 
                filters={store.getState().filters}
                setFilters={setFiltersFn}
            />, div);
    })

    it('#### snpashot of ListActions (post) with "score" sort', () => {
        expect(toJson(listActionsPost.find(ListActions))).toMatchSnapshot()
    })

    it('#### snpashot of ListActions (comment) with "recent" sort', () => {
        expect(toJson(listActionsComment.find(ListActions))).toMatchSnapshot()
    })

    it('#### simulates sort change', () => {
        listActionsPost.find('a').at(1).simulate('click')
        expect(setFiltersFn).toHaveBeenCalledWith({
            ...store.getState().filters,
            sortByPost: 'recent'
        })

        listActionsComment.find('a').at(0).simulate('click')
        expect(setFiltersFn).toHaveBeenLastCalledWith({
            sortByComment: 'score'
        })
    })

    it('#### simulates post creation', () => {
        listActionsPost.find('Button').simulate('click')
        expect(setFiltersFn).toHaveBeenLastCalledWith({
            ...store.getState().filters,
            isCreatingPost: true
        })
    })

    it('#### simulates comment creation', () => {
        listActionsComment.find('Button').simulate('click')
        expect(setFiltersFn).toHaveBeenLastCalledWith({
            isCreatingComment: true,
            sortByComment: 'recent'
        })
    })
})