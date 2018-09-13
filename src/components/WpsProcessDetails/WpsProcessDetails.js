import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import Card from'@material-ui/core/Card';
import CardHeader from'@material-ui/core/CardHeader';

const styles = {
  marginated: {
    'margin': '10px 0'
  }
};

class WpsProcessDetails extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired
  };

  render () {
    return (
      <Card className={this.props.classes.marginated}>
        <CardHeader
          title={this.props.workflow.selectedProcess.title}
          subheader={this.props.workflow.selectedProcess.abstract} />
      </Card>
    );
  }
}

export default withStyles(styles)(WpsProcessDetails)
