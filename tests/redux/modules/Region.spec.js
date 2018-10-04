import reducer, { initialState } from 'redux/modules/Region'

describe('(Redux) Region', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
