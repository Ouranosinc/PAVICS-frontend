import React from 'react'
import Panel from './../../components/Panel'
import Table, {TableHeader, TableBody, SelectableTableRow} from './../../components/Table'
class ClimateIndicators extends React.Component {
  static propTypes = {
    fetchClimateIndicators: React.PropTypes.func.isRequired,
    climateIndicators: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.fetchClimateIndicators();
  }

  _formatRows() {
    if (this.props.climateIndicators.items.length === 0) {
      return []
    }
    else {
      return this.props.climateIndicators.items.map(x => [x.value]);
    }
  }

  render() {
    return (
      <Panel>
        <Table>
          <TableHeader fields={["Header"]}/>
          <TableBody rows={this._formatRows()} selectedIndex={-1}/>
        </Table>
      </Panel>
    );
  }
}
export default ClimateIndicators
