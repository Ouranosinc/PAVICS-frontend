import reducer, { initialState } from 'redux/modules/Monitor'

describe('(Redux) Monitor', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
