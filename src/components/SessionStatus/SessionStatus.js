import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import {List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import GroupIcon from 'material-ui/svg-icons/social/group';

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
    sessionStatus: React.PropTypes.object.isRequired,
    makeZigguratLoginRequest: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired
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
          <Subheader style={{'paddingLeft': '0'}}>Access groups</Subheader>
          {this.props.sessionStatus.user.groups.map((group, i) =>
            <ListItem
              key={i}
              leftIcon={<GroupIcon />}
              primaryText={group} />
          )}
        </List>
        <RaisedButton style={{marginTop: '10px'}} id="cy-logout-btn" onTouchTap={this.logout} label="Logout" primary />
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
        <SelectField
          id="cy-login-provider-sf"
          floatingLabelText="Login Authority"
          value={this.state.provider}
          onChange={this.handleProviderChange}>
          { PROVIDERS.map(provider => <MenuItem value={provider.provider_name} primaryText={provider.display_text} /> ) }
        </SelectField>
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
        <RaisedButton id="cy-login-btn"  onTouchTap={this.submit} label="Login" primary />
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
