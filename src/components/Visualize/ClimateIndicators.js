import React from 'react';
import PropTypes from 'prop-types';
import Panel, {PanelHeader} from './../../components/Panel';
import Table, {TableHeader, TableBody} from './../../components/Table';
import * as constants from '../../constants';
class ClimateIndicators extends React.Component {
  static propTypes = {
    fetchClimateIndicators: PropTypes.func.isRequired,
    climateIndicators: PropTypes.object.isRequired,
    clickTogglePanel: PropTypes.func.isRequired,
    panelControls: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this.props.fetchClimateIndicators();
    this.togglePanel = this.togglePanel.bind(this);
  }

  formatRows () {
    if (this.props.climateIndicators.items.length === 0) {
      return [];
    } else {
      return this.props.climateIndicators.items.map((x, i) => [
        <input type="radio" name="climate-indicator" key={i} />,
        x.value
      ]);
    }
  }

  togglePanel = () => {
    let newState = !this.props.panelControls[constants.PANEL_CLIMATE_INDICATORS].show;
    this.props.clickTogglePanel(constants.PANEL_CLIMATE_INDICATORS, newState);
  };

  render () {
    return (
      <Panel>
        <PanelHeader
          onClick={this.togglePanel}
          icon="glyphicon-list"
          panelIsActive={this.props.panelControls[constants.PANEL_CLIMATE_INDICATORS].show}>
          Climate Indicators
        </PanelHeader>
        {
          this.props.panelControls[constants.PANEL_CLIMATE_INDICATORS].show
            ? (
            <Table>
              <TableHeader fields={['', 'Indicator Name']} />
              <TableBody rows={this.formatRows()} selectedIndex={-1} />
            </Table>
          )
            : null
        }

      </Panel>
    );
  }
}
export default ClimateIndicators;
