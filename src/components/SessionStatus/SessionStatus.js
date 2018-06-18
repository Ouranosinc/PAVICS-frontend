import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from'@material-ui/core/Select';
import {List, ListItem } from'@material-ui/core/List';
import ListSubheader from'@material-ui/core/ListSubheader';
import MenuItem from'@material-ui/core/MenuItem';
import TextField from'@material-ui/core/TextField';
import Button from'@material-ui/core/Button';
import GroupIcon from '@material-ui/icons/Group';

export const PROVIDER_ZIGGURAT = 'PROVIDER_ZIGGURAT';
export const PROVIDER_ESGF = 'PROVIDER_ESGF';
export const PROVIDER_OPENID = 'PROVIDER_OPENID';

const PROVIDERS = [
  {
    provider_name: PROVIDER_ZIGGURAT,
    display_text: 'Ouranos'
  },
  /*
  TODO bring back when implementing better login options
  {
    provider_name: PROVIDER_ESGF,
    display_text: 'ESGF'
  },
  {
    provider_name: PROVIDER_OPENID,
    display_text: 'OpenID'
  },
  */
];

export default class SessionStatus extends Component {

  static propTypes = {
    sessionStatus: PropTypes.object.isRequired,
    makeZigguratLoginRequest: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      provider: PROVIDER_ZIGGURAT,
      username: '',
      password: '',
      ogiginalState: 'empty string'
    };
  }

  logout() {
    this.props.logout();
  }

  makeUserCard () {
    return (
      <div>
        <h3>Logged in as "{this.props.sessionStatus.user.username}"</h3>
        <TextField
          fullWidth={true}
          disabled={true}
          value={this.props.sessionStatus.user.username}
          hintText="Username"
          floatingLabelText="Username"/>
        <TextField
          disabled={true}
          fullWidth={true}
          value={this.props.sessionStatus.user.email}
          hintText="Email"
          floatingLabelText="Email"/>
        <List fullWidth={true}>
          <ListSubheader style={{'paddingLeft': '0'}}>Access groups</ListSubheader>
          {this.props.sessionStatus.user.groups.map((group, i) =>
            <ListItem
              key={i}
              leftIcon={<GroupIcon />}
              primaryText={group} />
          )}
        </List>
        <Button variant="contained" style={{marginTop: '10px'}} id="cy-logout-btn" onClick={this.logout} label="Logout" primary />
      </div>
    );
  }

  handleProviderChange = (event, index, value) => this.setState({provider: value});
  handleUsernameChange = (event, value) => this.setState({username: value});
  handlePasswordChange = (event, value) => this.setState({password: value});

  submit = () => {
    console.log('submitting login %o', this.state);
    this.props.makeZigguratLoginRequest(this.state.username, this.state.password);
  };

  makeLoginForm () {
    return (
      <div>
        <Select
          id="cy-login-provider-sf"
          floatingLabelText="Login Authority"
          value={this.state.provider}
          onChange={this.handleProviderChange}>
          { PROVIDERS.map(provider => <MenuItem value={provider.provider_name} primaryText={provider.display_text} /> ) }
        </Select>
        <br />
        <TextField
          id="cy-login-user-tf"
          value={this.state.username}
          onChange={this.handleUsernameChange} hintText="Username" />
        <br />
        <TextField
          id="cy-login-password-tf"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          hintText="Password"
          type="password" /><br />
        <Button variant="contained" id="cy-login-btn"  onClick={this.submit} label="Login" primary />
      </div>
    );
  }

  render () {
    return (
      <div className="sessionstatus">
        {this.props.sessionStatus.user.authenticated ? this.makeUserCard() : this.makeLoginForm()}
      </div>
    );
  }
}
