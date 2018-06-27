import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from'@material-ui/core/Card';
import CardContent from'@material-ui/core/CardContent';
import CardHeader from'@material-ui/core/CardHeader';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Paper from'@material-ui/core/Paper';

const styles = {
  content: {
    paddingTop: 0
  },
  button: {
    margin: 0
  },
  grid: {
    'max-height': '450px',
    'overflowY': 'auto',
    'margin': '10px 0'
  },
  card: {
    margin: '0 5px 5px 0'
  }
};

class WpsProcessSelector extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const { classes } = this.props;
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
              fullWidth
              onChange={(event) => this.props.onSearchKeywordChanged(event.target.value)}
              label="Filter list by keyword" />
          </div>
        </Paper>
        <div className={classes.grid}>
          {
            filteredProcesses.map((process, i) => {
              return (
                <Card className={classes.card} key={i}>
                  <CardHeader
                    title={process.title}
                    subheader={process.description} />
                  <CardContent className={classes.content}>
                    <Button
                      className={classes.button}
                      variant="raised"
                      color="primary"
                      onClick={this.makeChooseProcessCallback(process)}>
                      Select Process
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WpsProcessSelector)
