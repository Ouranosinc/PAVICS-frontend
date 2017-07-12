import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
export default class WpsProcessDetails extends React.Component {
  static propTypes = {
    workflow: React.PropTypes.object.isRequired
  };
  render () {
    const marginated = {
      'margin': '10px 0'
    };
    return (
      <Card style={marginated}>
        <CardHeader title={this.props.workflow.selectedProcess.title} />
        <CardText>
          {this.props.workflow.selectedProcess.description}
        </CardText>
      </Card>
    );
  }
}
