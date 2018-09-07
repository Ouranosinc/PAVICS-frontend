import reducer, { initialState } from 'redux/modules/DrawFeature'

describe('(Redux) DrawFeature', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
