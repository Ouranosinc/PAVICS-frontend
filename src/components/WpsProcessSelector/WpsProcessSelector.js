import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

export default class WpsProcessSelector extends React.Component {
  static propTypes = {
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKeyWord: ''
    }
  }

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
    let filteredProcesses = this.props.workflow.processes;
    if (this.state.searchKeyWord.length) {
      filteredProcesses = this.props.workflow.processes.filter((process) => {
        return process.identifier.toUpperCase().includes(this.state.searchKeyWord.toUpperCase()) ||
          process.title.toUpperCase().includes(this.state.searchKeyWord.toUpperCase()) ||
          process.description.toUpperCase().includes(this.state.searchKeyWord.toUpperCase());
      });
    }
    return (
      <div>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              id="cy-filter-by-keyword"
              hintText="Filter list by keyword"
              fullWidth={true}
              onChange={(event, value) => this.setState({searchKeyWord: value})}
              floatingLabelText="Filter by" />
          </div>
        </Paper>
        <div style={gridStyle}>
          {
            filteredProcesses.map((process, i) => {
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
