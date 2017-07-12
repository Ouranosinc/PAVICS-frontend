import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
export default class WpsProcessSelector extends React.Component {
  static propTypes = {
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  makeChooseProcessCallback (process) {
    return () => {
      this.props.workflowActions.chooseProcess(process);
      this.props.workflowActions.fetchProcessInputs(this.props.workflow.selectedProvider, process.identifier);
    };
  }

  render () {
    const gridStyle = {
      'height': '450px',
      'overflowY': 'auto',
      'margin': '10px 0'
    };
    return (
      <div>
        <div style={gridStyle}>
          {
            this.props.workflow.processes.map((process, i) => {
              return (
                <Card key={i}>
                  <CardHeader
                    title={process.title} />
                  <CardText>{process.description}</CardText>
                  <CardActions>
                    <RaisedButton
                      primary={true}
                      label="Select Process"
                      onClick={this.makeChooseProcessCallback(process)} />
                  </CardActions>
                </Card>
              );
            })
          }
        </div>
      </div>
    );
  }
}
