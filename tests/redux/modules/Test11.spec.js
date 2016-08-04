import reducer, { initialState } from 'redux/modules/Test11'

describe('(Redux) Test11', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
