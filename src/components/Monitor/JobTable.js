import {Panel, Grid, Row, Col} from 'react-bootstrap';
import {AgGridReact} from 'ag-grid-react';
import './../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './../../../node_modules/ag-grid/dist/styles/theme-bootstrap.css';
import classes from './Monitor.scss';
import React from 'react';
import LinkCellRenderer from './LinkCellRenderer';
class JobTable extends React.Component {
  static propTypes = {
    jobs: React.PropTypes.array.isRequired
  };

  columnDefs () {
    return [
      {headerName: 'Process Identifier', field: 'title'},
      {headerName: 'Status', field: 'status'},
      {headerName: 'Duration', field: 'duration'},
      {headerName: 'Result (xml)', field: 'status_location', cellRendererFramework: LinkCellRenderer}
    ];
  }

  // please leave there even if ide says it's unused
  // it actually ensures columns are fit
  componentDidUpdate = () => {
    if (this.api) {
      this.api.sizeColumnsToFit();
    }
  };

  onGridReady = (params) => {
    this.api = params.api;
  };

  render () {
    return (
      <Grid className={classes.Monitor}>
        <Row>
          <Col mdOffset={2} md={8}>
            <Panel header="Jobs">
              <div className={classes.agGrid + ' ag-bootstrap'}>
                <AgGridReact
                  onGridReady={this.onGridReady}
                  className={classes.agGrid}
                  rowData={this.props.jobs}
                  columnDefs={this.columnDefs()}
                  enableSorting
                />
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default JobTable;
