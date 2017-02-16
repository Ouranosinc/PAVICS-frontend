import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classes from './ExperienceManagement.scss';
import {List, ListItem} from 'material-ui/List';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Download from 'material-ui/svg-icons/file/file-download';
import Visualize from 'material-ui/svg-icons/image/remove-red-eye';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderSpecial from 'material-ui/svg-icons/notification/folder-special';
import File from 'material-ui/svg-icons/editor/insert-drive-file';
import AddedCriterias from 'material-ui/svg-icons/image/add-to-photos';
import Relaunch from 'material-ui/svg-icons/action/youtube-searched-for';

export class ExperienceManagement extends React.Component {
  static propTypes = {
    currentProjectDatasets: React.PropTypes.array.isRequired,
    currentProjectSearchCriterias: React.PropTypes.array.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired
  }

  state = {
    open: false
  };

  constructor (props) {
    super(props);
    this._onVisualizeLayer = this._onVisualizeLayer.bind(this);
    this._onRelaunchSearch = this._onRelaunchSearch.bind(this);
  }

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open
    });
  };

  _onVisualizeLayer (event, dataset, currentWmsUrl, i) {
    dataset['wms_url'] = currentWmsUrl;
    dataset['currentWmsIndex'] = i;
    this.props.addDatasetLayersToVisualize([dataset]);
  }

  _onRelaunchSearch (index) {
    alert(index);
  }

  render () {
    return (
      <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
        <Paper>
          <List>
            <Subheader>Project datasets</Subheader>
            {this.props.currentProjectDatasets.map((dataset, i) => {
              let folderIcon = <Folder />;
              if (this.props.currentVisualizedDatasetLayers.find(x => x.dataset_id === dataset.dataset_id)) {
                folderIcon = <FolderSpecial />;
              }
              return (
                <ListItem
                  key={i}
                  primaryText={dataset.dataset_id}
                  secondaryText={
                    <p>
                      <span style={{color: darkBlack}}>{dataset.variable_long_name[0]}</span><br />
                      <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                    </p>
                  }
                  secondaryTextLines={2}
                  leftIcon={folderIcon}
                  initiallyOpen={false}
                  primaryTogglesNestedList={false}
                  nestedItems={[
                    dataset.wms_urls.map((wmsUrl, j) => {
                      let text = '/'; // 'DATASET=';
                      let fileName = wmsUrl.substr(wmsUrl.lastIndexOf(text) + text.length);
                      let nestedIcon = <File />;
                      let disabledNestedVisualize = false;
                      if (this.props.currentVisualizedDatasetLayers.find(x => x.wms_url ===  wmsUrl)) {
                        nestedIcon = <Visualize />;
                        disabledNestedVisualize = true;
                      }
                      return (
                        <ListItem
                          style={{width: '98%'}}
                          key={i}
                          primaryText={fileName}
                          leftIcon={nestedIcon}
                          rightIconButton={
                            <IconMenu iconButtonElement={
                              <IconButton
                                touch={true}
                                tooltip="Actions"
                                tooltipPosition="bottom-left">
                                <MoreVertIcon color={grey400} />
                              </IconButton>}>
                              <MenuItem primaryText="Visualize" disabled={disabledNestedVisualize} onTouchTap={(event) => {
                                this._onVisualizeLayer(event, dataset, wmsUrl, j)
                              }} leftIcon={<Visualize />} />
                              <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.opendap_urls[i], '_blank')} leftIcon={<Download />} />
                              <MenuItem primaryText="Remove (TODO?)" onTouchTap={(event) => alert('remove ' + fileName)} leftIcon={<Remove />} />
                            </IconMenu>
                          }
                        />
                      );
                    })
                  ]}
                />
              );
            })}
          </List>
        </Paper>

        <Paper style={{marginTop: 20}}>
          <List>
            <Subheader>Project search criterias</Subheader>
            {this.props.currentProjectSearchCriterias.map((search, index) => {
              return (
                <ListItem
                  key={index}
                  primaryText={search.name}
                  secondaryText={
                    <p>
                      <strong>Facets: </strong>
                      <span>
                        {
                          search.criterias.map((criteria) => {
                            return <span>{criteria.key + '=' + criteria.value + ', '}</span>;
                          })
                        }
                      </span>
                    </p>
                  }
                  secondaryTextLines={2}
                  leftIcon={<AddedCriterias />}
                  rightIconButton={
                    <IconMenu iconButtonElement={
                      <IconButton
                        touch={true}
                        tooltip="Actions"
                        tooltipPosition="bottom-left">
                        <MoreVertIcon color={grey400} />
                      </IconButton>}>
                      <MenuItem primaryText="Relaunch search (TODO)" onTouchTap={(event) => { this._onRelaunchSearch(index); }} leftIcon={<Relaunch />} />
                      <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + search.name)} leftIcon={<Remove />} />
                    </IconMenu>
                  }
                />
              );
            })}
          </List>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}
const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperienceManagement);
