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
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this.state = {
      isSnackbarOpen: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.project && nextProps.project.currentProject.id !== this.props.project.currentProject.id) {
      this.setState({
        isSnackbarOpen: true
      });
    }
  }

  _handleGoToExperimentManagement () {
    this.props.goToSection(constants.PLATFORM_SECTION_PROJECT_MANAGEMENT);
  }

  _handleRequestClose = () => {
    this.setState({
      isSnackbarOpen: false
    });
  };

  render () {
    return (
      <div>
        {/*<Snackbar className={classes['CurrentProjectSnackbar']}
         contentStyle={{fontWeight: 'bold'}}
         open={this.state.isSnackbarOpen}
         message={ `Current Project: ${this.props.project.currentProject.name}`}
         action="change"
         autoHideDuration={5000}
         onRequestClose={(reason) => this._handleRequestClose()}
         onActionTouchTap={(event) => this._handleGoToExperimentManagement()}>
         </Snackbar>*/}
      </div>
    )
  }
}

export default CurrentProjectSnackbar
