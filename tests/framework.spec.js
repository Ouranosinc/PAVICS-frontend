import assert from 'assert';
import React from 'react';
import PropTypes from 'prop-types';
import {mount, render, shallow} from 'enzyme'

class Fixture extends React.Component {
  render () {
    return (
      <React.Fragment>
        <input id='checked' defaultChecked />
        <input id='not' defaultChecked={false} />
      </React.Fragment>
    )
  }
}

describe('(Framework) Karma Plugins', function () {
  it('Should expose "expect" globally.', function () {
    assert.ok(expect)
  })

  it('Should expose "should" globally.', function () {
    assert.ok(should)
  })

  it('Should have chai-as-promised helpers.', function () {
    const pass = new Promise(res => res('test'))
    const fail = new Promise((res, rej) => rej())

    return Promise.all([
      expect(pass).to.be.fulfilled,
      expect(fail).to.not.be.fulfilled
    ])
  })

  it('should have chai-enzyme working', function() {
    let wrapper = shallow(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()

    wrapper = mount(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()

    wrapper = render(<Fixture />)
    expect(wrapper.find('#checked')).to.be.checked()
  })
})
