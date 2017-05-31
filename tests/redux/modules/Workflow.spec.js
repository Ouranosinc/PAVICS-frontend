import reducer, { initialState } from 'redux/modules/Workflow'

describe('(Redux) Workflow', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
