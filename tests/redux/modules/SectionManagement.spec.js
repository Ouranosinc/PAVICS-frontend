import reducer, { initialState } from 'redux/modules/SectionManagement'

describe('(Redux) SectionManagement', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
