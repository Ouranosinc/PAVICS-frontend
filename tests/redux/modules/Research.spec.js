import reducer, { initialState } from 'redux/modules/Research'

describe('(Redux) Research', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
