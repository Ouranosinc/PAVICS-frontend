import reducer, { initialState } from 'redux/modules/Project'

describe('(Redux) Project', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
