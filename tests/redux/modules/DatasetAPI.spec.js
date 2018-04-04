import reducer, { initialState } from 'redux/modules/DatasetAPI'

describe('(Redux) DatasetAPI', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
