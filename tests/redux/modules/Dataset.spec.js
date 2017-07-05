import reducer, { initialState } from 'redux/modules/Dataset'

describe('(Redux) Dataset', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
