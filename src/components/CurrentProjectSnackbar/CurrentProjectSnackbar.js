import React from 'react'
import classes from './CurrentProjectSnackbar.scss';
import * as constants from './../../constants';
import Snackbar from 'material-ui/Snackbar';

export class CurrentProjectSnackbar extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    project: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._handleGoToExperimentManagement = this._handleGoToExperimentManagement.bind(this);
    this.state = {
      isSnackbarOpen: true
    }
  }

  _handleGoToExperimentManagement () {
    this.props.goToSection(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT);
  }

  render () {
    return (
      <Snackbar className={classes['CurrentProjectSnackbar']}
          open={this.state.isSnackbarOpen}
          message={`Current Project: ${this.props.project.currentProject.name}`}
          action="change"
          autoHideDuration={99999999}
          onRequestClose={(reason) => {/* DO NOT AUTO-CLOSE */}}
          onActionTouchTap={(event) => this._handleGoToExperimentManagement()}>
      </Snackbar>
    )
  }
}

export default CurrentProjectSnackbar
