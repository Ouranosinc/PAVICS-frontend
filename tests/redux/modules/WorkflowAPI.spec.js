import reducer, { initialState } from 'redux/modules/WorkflowAPI'

describe('(Redux) WorkflowAPI', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
