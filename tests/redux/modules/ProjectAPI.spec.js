import reducer, { initialState } from 'redux/modules/ProjectAPI'

describe('(Redux) ProjectAPI', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
