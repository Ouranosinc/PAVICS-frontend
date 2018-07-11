import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as datasetAPIActions } from '../../redux/modules/DatasetAPI';
import { actions as projectActions } from './../../redux/modules/Project';
import { actions as projectAPIActions } from '../../redux/modules/ProjectAPI';
import { actions as researchActions } from './../../redux/modules/Research';
import { actions as researchAPIActions } from '../../redux/modules/ResearchAPI';
import { actions as sectionActions } from '../../redux/modules/Section';
import { actions as sessionActions } from '../../redux/modules/Session';
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import SearchCatalog from './../../components/SearchCatalog';

export class ResearchContainer extends React.Component {
  static propTypes = {};

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
    session: state.session,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    datasetAPIActions: bindActionCreators({...datasetAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActions}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActions}, dispatch),
    researchActions: bindActionCreators({...researchActions}, dispatch),
    sessionActions: bindActionCreators({...sessionActions}, dispatch),
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchContainer)
