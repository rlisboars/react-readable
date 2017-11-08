import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-15'

describe('App Component testing', () => {
    it('##### renders without crashing', () => {
        expect(shallow(<App/>).length).toEqual(1)
    });
    it('#### capturing snapshot of App', () => {
        const wrapper = shallow(<App/>)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})

