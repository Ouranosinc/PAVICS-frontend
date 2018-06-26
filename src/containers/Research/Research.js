import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as datasetAPIActionsCreators } from '../../redux/modules/DatasetAPI';
import { actions as projectActionsCreators } from './../../redux/modules/Project';
import { actions as projectAPIActionsCreators } from '../../redux/modules/ProjectAPI';
import { actions as researchActionsCreators } from './../../redux/modules/Research';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';
import { actions as sessionManagementActionsCreators } from '../../redux/modules/SessionManagement';

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
    datasetAPI: state.datasetAPI,
    project: state.project,
    projectAPI: state.projectAPI,
    research: state.research,
    researchAPI: state.researchAPI,
    sessionManagement: state.sessionManagement,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    datasetAPIActions: bindActionCreators({...datasetAPIActionsCreators}, dispatch),
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActionsCreators}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch),
    accountManagementActions: bindActionCreators({...sessionManagementActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchContainer)
