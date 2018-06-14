import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Dialog from'@material-ui/core/Dialog';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Checkbox from'@material-ui/core/Checkbox';
import Card from'@material-ui/core/Card';
import CardContent from'@material-ui/core/CardContent';
import Switch from'@material-ui/core/Switch';
import ListSubheader from'@material-ui/core/ListSubheader';
import { List, ListItem } from'@material-ui/core/List';
import IconButton from'@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle'

export class PersistResultDialog extends React.Component {
  static propTypes = {
    output: PropTypes.object.isRequired,
    isOpen:  PropTypes.bool.isRequired,
    onPersistConfirmed: PropTypes.func.isRequired,
    closePersistDialog: PropTypes.func.isRequired,
    monitorActions: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired
  };
  constructor (props) {
    super(props);
    this.state = {
      expanded: false,
      key: '',
      location: `${__PAVICS_DEFAULT_WORKSPACE_FOLDER__}/`,
      value: '',
      facets: [],
      overwrite: false
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.username && nextProps.output && nextProps.output.reference && nextProps.output.reference.length) {
      let text = '/';
      let fileName = nextProps.output.reference.substr(nextProps.output.reference.lastIndexOf(text) + text.length);
      this.setState({
        location: `${__PAVICS_DEFAULT_WORKSPACE_FOLDER__}/${nextProps.username}/${fileName}`
      });
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleKeyChange = (e) => {
    this.setState({
      key: e.target.value
    });
  };

  handleLocationChange = (e) => {
    this.setState({
      location: e.target.value
    });
  };

  handleValueChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  handleOverwriteChange = (e) => {
    this.setState({
      overwrite: !this.state.overwrite
    });
  };

  onPersistOutputClicked = () => {
    let defaultFacets = {};
    this.state.facets.forEach((facet) => {
      defaultFacets[facet.key] = facet.value;
    });
    this.props.monitorActions.persistTemporaryResult(this.props.output.reference,
      this.state.location, this.state.overwrite, defaultFacets);
    this.props.onPersistConfirmed();
  };

  onAddedFacet = () => {
    let facets = this.state.facets;
    if (this.state.key.length ||this.state.value.length){
      facets.push({key: this.state.key, value: this.state.value});
      this.setState({
        facets: facets,
        key: '',
        value: ''
      });
    }
  };

  onRemovedFacet = (index) => {
    let facets = this.state.facets;
    facets.splice(index, 1);
    this.setState({
      facets: facets,
      key: '',
      value: ''
    });
  };

  render () {
      return <Dialog
        id="cy-persist-dialog"
        title="Persist result"
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.closePersistDialog}
        actions={
          [
            <Button variant="contained"
              id="cy-persist-dialog-launch-btn"
              label="Launch Persist"
              primary={true}
              keyboardFocused={true}
              onTouchTap={(event) => this.onPersistOutputClicked()}
              style={{marginRight: '10px' }} />,
            <Button variant="contained"
              id="cy-persist-dialog-close-btn"
              label="Close"
              primary={false}
              keyboardFocused={false}
              onTouchTap={this.props.closePersistDialog} />
          ]
        }
        autoScrollBodyContent={true}>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardContent>
            <TextField
              id="cy-resource-link-tf"
              hintText="Resource"
              fullWidth={true}
              disabled={true}
              value={this.props.output.reference}
              floatingLabelText="Resource to persist" />
            <Checkbox
              id="cy-overwrite-destination-cb"
              label="Overwrite destination"
              labelPosition="right"
              labelStyle={{textAlign: "left"}}
              checked={this.state.overwrite}
              onCheck={this.handleOverwriteChange}/>
          </CardContent>
          <CardContent>
            <Switch
              id="cy-advanced-toggle"
              checked={this.state.expanded}
              onChanged={this.handleToggle}
              labelPosition="right"
              label="Advanced configuration"
            />
          </CardContent>
          <CardContent expandable={true}>
            <TextField
              id="cy-workspace-path-tf"
              hintText="Location"
              fullWidth={true}
              value={this.state.location}
              onChange={this.handleLocationChange}
              floatingLabelText="Location" />
            <Row>
              <Col sm={4} md={4} lg={4}>
                <TextField
                  hintText="Key"
                  fullWidth={true}
                  onChange={this.handleKeyChange}
                  floatingLabelText="Key"
                  value={this.state.key} />
              </Col>
              <Col sm={4} md={4} lg={4}>
                <TextField
                  hintText="Value"
                  fullWidth={true}
                  onChange={this.handleValueChange}
                  floatingLabelText="Value"
                  value={this.state.value} />
              </Col>
              <Col sm={4} md={4} lg={4}>
                <Button variant="contained"
                  style={{marginTop: '25px'}}
                  label="Add"
                  primary={false}
                  keyboardFocused={true}
                  onTouchTap={this.onAddedFacet} />
              </Col>
            </Row>
            <Row>
              <List>
                <ListSubheader>Default facets</ListSubheader>
                {
                  this.state.facets.map((facet, index) => {
                    return (
                      <ListItem
                        key={index}
                        primaryText={facet.key + '-' + facet.value}
                        rightIconButton={
                          <IconButton>
                            <RemoveIcon onTouchTap={(event) => this.onRemovedFacet(index)} />
                          </IconButton>
                        }
                      />
                    );
                  })
                }
              </List>
            </Row>
          </CardContent>
        </Card>
      </Dialog>;
   }
}
export default PersistResultDialog;

