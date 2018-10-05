import reducer, { initialState } from 'redux/modules/LayerDataset'

describe('(Redux) LayerDataset', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
