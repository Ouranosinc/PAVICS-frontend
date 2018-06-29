import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Dialog from'@material-ui/core/Dialog';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import Checkbox from'@material-ui/core/Checkbox';
import Card from'@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from'@material-ui/core/CardContent';
import CardHeader from'@material-ui/core/CardHeader';
import Switch from'@material-ui/core/Switch';
import List from'@material-ui/core/List';
import ListItem from'@material-ui/core/List';
import ListItemSecondaryAction from'@material-ui/core/ListItemSecondaryAction';
import ListItemText from'@material-ui/core/ListItemText';
import ListSubheader from'@material-ui/core/ListSubheader';
import IconButton from'@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

  handleToggle = (event) => {
    this.setState({expanded: event.target.checked});
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

  handleOverwriteChange = (event) => {
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
        onRequestClose={this.props.closePersistDialog}>
        <Card style={{width: '600px'}}>
          <CardHeader title="Persist a temporary resource" />
          <CardContent>
            <TextField
              id="cy-resource-link-tf"
              fullWidth
              disabled={true}
              value={this.props.output.reference}
              label="Resource to persist" />
            <FormControlLabel
              control={
                <Checkbox
                  id="cy-overwrite-destination-cb"
                  checked={this.state.overwrite}
                  onChange={this.handleOverwriteChange}/>
              }
              labelStyle={{textAlign: "left"}}
              label="Overwrite destination"
            />
          </CardContent>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  id="cy-advanced-toggle"
                  checked={this.state.expanded}
                  onChange={this.handleToggle} />
              }
              label="Advanced configuration"
            />
          </CardContent>
          <Collapse in={this.state.expanded}>
            <CardContent>
              <TextField
                id="cy-workspace-path-tf"
                fullWidth
                value={this.state.location}
                onChange={this.handleLocationChange}
                label="Location" />
              <Row>
                <Col sm={4} md={4} lg={4}>
                  <TextField
                    fullWidth
                    onChange={this.handleKeyChange}
                    label="Key"
                    value={this.state.key} />
                </Col>
                <Col sm={4} md={4} lg={4}>
                  <TextField
                    fullWidth
                    onChange={this.handleValueChange}
                    label="Value"
                    value={this.state.value} />
                </Col>
                <Col sm={4} md={4} lg={4}>
                  <Button variant="contained"
                          onClick={this.onAddedFacet}
                          style={{marginTop: '25px'}}
                          color="primary">
                      Add
                    </Button>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <List>
                    <ListSubheader style={{'paddingLeft': '0'}}>Default facets</ListSubheader>
                    {
                      this.state.facets.map((facet, index) => {
                        return (
                          <ListItem
                            key={index}>
                            <ListItemText primary={facet.key + '-' + facet.value} />
                            <ListItemSecondaryAction>
                              <IconButton onClick={(event) => this.onRemovedFacet(index)}>
                                <RemoveIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })
                    }
                  </List>
                </Col>
              </Row>
            </CardContent>
          </Collapse>
          <CardActions>
            <Button variant="contained"
                    color="primary"
                    style={{marginRight: '10px' }}
                    id="cy-persist-dialog-launch-btn"
                    onClick={(event) => this.onPersistOutputClicked()}>
              Launch Persist
            </Button>,
            <Button variant="contained"
                    color="secondary"
                    id="cy-persist-dialog-close-btn"
                    onClick={this.props.closePersistDialog}>
              Close
            </Button>
          </CardActions>
        </Card>
      </Dialog>;
   }
}
export default PersistResultDialog;

