import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import 'babel-polyfill'

configure({ adapter: new Adapter() })