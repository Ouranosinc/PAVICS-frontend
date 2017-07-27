import reducer, { initialState } from 'redux/modules/JobAPI'

describe('(Redux) JobAPI', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
