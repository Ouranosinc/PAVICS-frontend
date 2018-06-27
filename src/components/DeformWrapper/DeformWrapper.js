import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import { Form } from 'react-bootstrap';
import { ExecuteButton } from '../WorkflowWizard';
import Typography from'@material-ui/core/Typography';
import Paper from'@material-ui/core/Paper';

const styles = {
  grid: {
    'max-height': '450px',
    'overflowY': 'auto',
    'margin': '10px 0',
    'overflowX': 'hidden'
  }
};

class DeformWrapper extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    formId: PropTypes.string.isRequired,
    execute: PropTypes.func.isRequired
  };

  // the form needs a submit named input to actually be executed by phoenix
  // so 1990
  render () {
    // TODO validate that async is really something we want each timeF
    return (
      // this id="FORM_ID" is used when submitting the form.
      // don't change or remove it, or make sure you update it in the execute function as well
      <Form id={this.props.formId} horizontal>
        <Paper elevation={2} className={this.props.classes.grid}>
          <div className="container">
            <Typography variant="headline">
              Required inputs
            </Typography>
            <input type="hidden" name="_charset_" value="UTF-8"/>
            <input type="hidden" name="__formid__" value="deform"/>
            <input type="hidden" name="_async_check" value="true"/>
            {this.props.children}
          </div>
        </Paper>
        <ExecuteButton executeProcess={this.props.execute}/>
        <input type="hidden" name="submit" value="submit"/>
      </Form>
    );
  }
}

export default withStyles(styles)(DeformWrapper)
