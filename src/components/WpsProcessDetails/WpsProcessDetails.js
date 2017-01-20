import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
export default class WpsProcessDetails extends React.Component {
  static propTypes = {
    process: React.PropTypes.object.isRequired
  };
  render () {
    const marginated = {
      'margin': '10px 0'
    };
    return (
      <Card style={marginated}>
        <CardHeader title={this.props.process.title} />
        <CardText>
          <p>label: {this.props.process.id}</p>
          <p>{this.props.process.description}</p>
        </CardText>
      </Card>
    );
  }
}
