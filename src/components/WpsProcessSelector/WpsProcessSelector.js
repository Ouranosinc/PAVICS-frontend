import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardActions, CardContent} from'@material-ui/core/Card';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Paper from'@material-ui/core/Paper';

export default class WpsProcessSelector extends React.Component {
  static propTypes = {
    onSearchKeywordChanged: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
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
              helperText="Filter list by keyword"
              fullWidth={true}
              onChange={(event, value) => this.props.onSearchKeywordChanged(value)}
              label="Filter by" />
          </div>
        </Paper>
        <div style={gridStyle}>
          {
            filteredProcesses.map((process, i) => {
              return (
                <Card key={i}>
                  <CardHeader
                    title={process.title} />
                  <CardContent>{process.description}</CardContent>
                  <CardActions>
                    <Button variant="contained"
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
