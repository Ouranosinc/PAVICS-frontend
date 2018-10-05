import reducer, { initialState } from 'redux/modules/LayerBasemap'

describe('(Redux) LayerBasemap', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
