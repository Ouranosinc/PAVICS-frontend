import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';
import { actions as researchActionsCreators } from './../../redux/modules/Research';

import SearchCatalog from './../../components/SearchCatalog';

export class ResearchContainer extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <SearchCatalog {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    researchAPIResults: state.researchAPI,
    research: state.research
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchContainer)
