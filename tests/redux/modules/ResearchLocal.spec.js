import reducer, { initialState } from 'redux/modules/ResearchLocal'

describe('(Redux) ResearchLocal', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
