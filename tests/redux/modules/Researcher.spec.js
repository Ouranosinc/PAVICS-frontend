import reducer, { initialState } from 'redux/modules/Researcher'

describe('(Redux) Researcher', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
