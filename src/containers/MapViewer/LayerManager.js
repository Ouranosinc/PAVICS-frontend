import React from 'react'
import Panel, {PanelHeader} from './../../components/Panel'
import Table, {TableHeader, TableBody} from './../../components/Table'
import * as constants from './../../routes/MapViewer/constants'

class LayerManager extends React.Component {
  static propTypes = {
    fetchWatershedLayer: React.PropTypes.func.isRequired,
    layerArray: React.PropTypes.object.isRequired,
    clickTogglePanel: React.PropTypes.func.isRequired,
    panelControls: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.props.fetchWatershedLayer()
    this._togglePanel = this._togglePanel.bind(this)
  }

  _formatRows () {
    if (this.props.layerArray.items.length === 0) {
      return []
    } else {
      return this.props.layerArray.items.map((x, i) => [
        <input type="radio" name="climate-indicator" key={i} />,
        x.value
      ])
    }
  }

  _togglePanel () {
    let newState = !this.props.panelControls[constants.PANEL_LAYER_MANAGER].show
    this.props.clickTogglePanel(constants.PANEL_LAYER_MANAGER, newState)
  }

  render () {
    return (
      <Panel>
        <PanelHeader
          onClick={this._togglePanel}
          icon="glyphicon-list"
          panelIsActive={this.props.panelControls[constants.PANEL_LAYER_MANAGER].show}>
          Layer Manager
        </PanelHeader>
        {
          this.props.panelControls[constants.PANEL_LAYER_MANAGER].show
            ? (
            <Table>
              <TableHeader fields={['', 'Indicator Name']} />
              <TableBody rows={this._formatRows()} selectedIndex={-1} />
            </Table>
          )
            : null
        }
      </Panel>
    )
  }
}
export default LayerManager
