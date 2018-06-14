import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardContent} from'@material-ui/core/Card';
export default class WpsProcessDetails extends React.Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };
  render () {
    const marginated = {
      'margin': '10px 0'
    };
    return (
      <Card style={marginated}>
        <CardHeader title={this.props.workflow.selectedProcess.title} />
        <CardContent>
          {this.props.workflow.selectedProcess.description}
        </CardContent>
      </Card>
    );
  }
}
