import reducer, { initialState } from 'redux/modules/ResearcherAPI'

describe('(Redux) ResearcherAPI', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
