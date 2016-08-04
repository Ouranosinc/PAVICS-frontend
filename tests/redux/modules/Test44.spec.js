import reducer, { initialState } from 'redux/modules/Test44'

describe('(Redux) Test44', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
