import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

export default class WpsProcessSelector extends React.Component {
  static propTypes = {
    onSearchKeywordChanged: React.PropTypes.func.isRequired,
    searchKeyword: React.PropTypes.string.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
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
    if (this.props.searchKeyword.length) {
      filteredProcesses = this.props.workflow.processes.filter((process) => {
        return process.identifier.toUpperCase().includes(this.props.searchKeyword.toUpperCase()) ||
          process.title.toUpperCase().includes(this.props.searchKeyword.toUpperCase()) ||
          process.description.toUpperCase().includes(this.props.searchKeyword.toUpperCase());
      });
    }
    return (
      <div>
        <Paper style={{marginTop: 20}}>
          <div className="container">
            <TextField
              id="cy-filter-by-keyword"
              value={this.props.searchKeyword}
              hintText="Filter list by keyword"
              fullWidth={true}
              onChange={(event, value) => this.props.onSearchKeywordChanged(value)}
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
