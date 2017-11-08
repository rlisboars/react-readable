import React from 'react'
import ReactDOM from  'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../components/Header'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'
import { store } from './mockStore'

describe('PostForm Component testing', () => {
    const getCategoriesFn = jest.fn()
    const setFiltersFn = jest.fn()

    const headerDisabled = mount(
        <MemoryRouter>
            <Header 
                disabled={true}
                filters={store.getState().filters}
                selected={store.getState().categories[1]}
                categories={store.getState().categories}
                getCategories={getCategoriesFn}
                setFilters={setFiltersFn}
                history={[]}
            />
        </MemoryRouter>
    )

    const headerEnabled = mount(
        <MemoryRouter>
            <Header 
                filters={{ ...store.getState().filters, category: 'react' }}
                selected={store.getState().categories[0]}
                categories={store.getState().categories}
                getCategories={getCategoriesFn}
                setFilters={setFiltersFn}
                history={[]}
            />
        </MemoryRouter>
    )

    it('##### renders form without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <MemoryRouter>
                <Header 
                    filters={store.getState().filters}
                    selected={store.getState().categories[1]}
                    categories={store.getState().categories}
                    getCategories={getCategoriesFn}
                    setFilters={setFiltersFn}
                />
            </MemoryRouter>, div);
    })

    it('#### snpashot of disabled header', () => {
        expect(toJson(headerDisabled.find(Header))).toMatchSnapshot()
    })

    it('#### snapshot of enabled header', () => {
        expect(toJson(headerEnabled.find(Header))).toMatchSnapshot()
    })

    it('#### simulates category change', () => {
        headerEnabled.setProps({
            selected: store.getState().categories[2]
        })
        headerEnabled.find('DropdownItem').at(0).simulate('click')
        expect(setFiltersFn).toHaveBeenCalledWith({
            ...store.getState().filters,
            category: store.getState().categories[0].name
        })
        headerEnabled.find('DropdownItem').at(1).simulate('click')
        expect(setFiltersFn).toHaveBeenCalledWith({
            ...store.getState().filters,
            category: store.getState().categories[1].name
        })
    })
})