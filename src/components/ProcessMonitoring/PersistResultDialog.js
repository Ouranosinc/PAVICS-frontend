import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Card from 'material-ui/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardTitle from 'material-ui/Card/CardTitle';
import FlatButton from 'material-ui/FlatButton';
import CardText from 'material-ui/Card/CardText';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle'

export class PersistResultDialog extends React.Component {
  static propTypes = {
    output: React.PropTypes.object.isRequired,
    isOpen:  React.PropTypes.bool.isRequired,
    onPersistConfirmed: React.PropTypes.func.isRequired,
    closePersistDialog: React.PropTypes.func.isRequired,
    monitorActions: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      expanded: false,
      key: '',
      location: 'workspaces/david/{yolo}/tata3.nc',
      value: '',
      facets: [],
      overwrite: false
    };
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
        title="Persist result"
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.closePersistDialog}
        actions={
          [
            <RaisedButton
              label="Launch Persist"
              primary={true}
              keyboardFocused={true}
              onTouchTap={(event) => this.onPersistOutputClicked()}
              style={{marginRight: '10px' }} />,
            <RaisedButton
              label="Close"
              primary={false}
              keyboardFocused={false}
              onTouchTap={this.props.closePersistDialog} />
          ]
        }
        autoScrollBodyContent={true}>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardText>
            <TextField
              hintText="Resource"
              fullWidth={true}
              disabled={true}
              value={this.props.output.reference}
              floatingLabelText="Resource to persist" />
            <Checkbox
              label="Overwrite destination"
              labelPosition="right"
              labelStyle={{textAlign: "left"}}
              checked={this.state.overwrite}
              onCheck={this.handleOverwriteChange}/>
          </CardText>
          <CardText>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label="Advanced configuration"
            />
          </CardText>
          <CardText expandable={true}>
            <TextField
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
                <RaisedButton
                  style={{marginTop: '25px'}}
                  label="Add"
                  primary={false}
                  keyboardFocused={true}
                  onTouchTap={this.onAddedFacet} />
              </Col>
            </Row>
            <Row>
              <List>
                <Subheader>Default facets</Subheader>
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
          </CardText>
        </Card>
      </Dialog>;
   }
}
export default PersistResultDialog;

