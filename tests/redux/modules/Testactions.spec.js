import reducer, { initialState } from 'redux/modules/Testactions'

describe('(Redux) Testactions', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
