import {Panel} from 'react-bootstrap';
import {IGetRowsParams} from 'ag-grid';
import {AgGridReact} from 'ag-grid-react';
import './../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './../../../node_modules/ag-grid/dist/styles/theme-bootstrap.css';
import classes from './Monitor.scss';
import React from 'react';
import LinkCellRenderer from './LinkCellRenderer';
import OnclickCellRenderer from './OnclickCellRenderer';
class JobTable extends React.Component {
  static propTypes = {
    jobs: React.PropTypes.array.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  columnDefs () {
    return [
      {headerName: 'Process Identifier', field: 'title'},
      {headerName: 'Status', field: 'status'},
      {headerName: 'Duration', field: 'duration'},
      {headerName: 'Result (xml)', field: 'status_location', cellRendererFramework: LinkCellRenderer},
      {headerName: 'Visualize', field: 'visualize', cellRendererFramework: OnclickCellRenderer}
    ];
  }

  // please leave there even if ide says it's unused
  // it actually ensures columns are fit
  componentDidUpdate = () => {
    if (this.api) {
      this.api.sizeColumnsToFit();
    }
    this.api.setDatasource(this.datasource());
  };

  datasource = () => {
    let sortData = (sortModel) => {
      if (sortModel && sortModel.length > 0) {
        let sortResult = this.props.jobs.slice();
        sortResult.sort((elemA, elemB) => {
          for (let i = 0, nbColumns = sortModel.length; i < nbColumns; i++) {
            let columnModel = sortModel[i];
            let valA = elemA[columnModel.colId];
            let valB = elemB[columnModel.colId];
            if (valA === valB) {
              continue;
            }
            let sortDirection = columnModel.sort === 'asc' ? 1 : -1;
            if (valA > valB) {
              return sortDirection;
            } else {
              return sortDirection * -1;
            }
          }
          return 0;
        });
        return sortResult;
      }
      return this.props.jobs;
    };
    return {
      rowCount: this.props.jobs.length,
      getRows: (params: IGetRowsParams) => {
        let rowCount = this.props.jobs.length;
        let rows = [];
        for (let i = params.startRow; i < params.endRow; i++) {
          if (this.props.jobs[i]) {
            let job = this.props.jobs[i];
            let param = job['status_location'];
            let click = (param) => {
              console.log('clicked:', param);
              this.props.fetchVisualizableData(param);
            };
            job['visualize'] = {
              'onclick': () => { click(param); }
            };
            rows.push(this.props.jobs[i]);
          }
        }
        params.successCallback(rows, rowCount);
      }
    };
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
                  columnDefs={this.columnDefs()}
                  rowModelType="pagination"
                  paginationPageSize={10}
                  rowHeight={25}
                  enableServerSideSorting
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
