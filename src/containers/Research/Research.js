import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActionsCreators } from './../../redux/modules/Project';
import { actions as researchActionsCreators } from './../../redux/modules/Research';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';

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
    project: state.project,
    researchAPI: state.researchAPI,
    research: state.research
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchContainer)
