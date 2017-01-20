import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
export default class WpsProcessSelector extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired
  }

  makeChooseProcessCallback (process) {
    return () => {
      this.props.chooseProcess(process);
      this.props.fetchProcessInputs(this.props.selectedProvider, process.identifier);
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
            this.props.processes.map((process, i) => {
              return (
                <Card key={i}>
                  <CardHeader
                    title={process.title} />
                  <CardText>{process.description}</CardText>
                  <CardActions>
                    <FlatButton label="Execute Process" onClick={this.makeChooseProcessCallback(process)} />
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
