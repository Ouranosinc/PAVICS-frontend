import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export const PROVIDER_ZIGGURAT = 'PROVIDER_ZIGGURAT';
export const PROVIDER_ESGF = 'PROVIDER_ESGF';
export const PROVIDER_OPENID = 'PROVIDER_OPENID';

export default class SessionStatus extends Component {

  static propTypes = {
    sessionStatus: React.PropTypes.object.isRequired,
    makeZigguratLoginRequest: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      provider: PROVIDER_ZIGGURAT,
      username: '',
      password: '',
      ogiginalState: 'empty string',
    };
  }

  makeUserCard() {
    return (
      <div>
        Hello {this.props.sessionStatus.user.username}!<br />
        <RaisedButton onTouchTap={this.props.logout} label="Logout" primary />
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

  makeLoginForm() {
    return (
      <div>
        <SelectField
          floatingLabelText="Provider"
          value={this.state.provider}
          onChange={this.handleProviderChange}
        >
          <MenuItem value={PROVIDER_ZIGGURAT} primaryText="Ziggurat" />
          <MenuItem value={PROVIDER_ESGF} primaryText="ESGF" />
          <MenuItem value={PROVIDER_OPENID} primaryText="OpenID" />
        </SelectField><br />
        <TextField value={this.state.username} onChange={this.handleUsernameChange} hintText="Username" /><br />
        <TextField value={this.state.password} onChange={this.handlePasswordChange} hintText="Password" type="password" /><br />
        <RaisedButton onTouchTap={this.submit} label="Login" primary />
      </div>
    );
  }

  render() {
    return (
      <div className="sessionstatus">
        {this.props.sessionStatus.user.authenticated ? this.makeUserCard() : this.makeLoginForm()}
      </div>
    );
  }
}
