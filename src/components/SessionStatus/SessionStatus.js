import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from'@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from'@material-ui/core/Typography';
import MenuItem from'@material-ui/core/MenuItem';
import TextField from'@material-ui/core/TextField';
import Button from'@material-ui/core/Button';
import Group from '@material-ui/icons/Group';
import { NotificationManager } from 'react-notifications';

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

const styles = theme => ({
  selectField: {
    marginBottom: '5px',
    marginTop: '5px'
  },
  textField: {
    marginBottom: '5px',
    marginTop: '5px'
  },
  button: {
    marginTop: '10px'
  }
});

export default withStyles(styles)(
  class SessionStatus extends Component {

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
        password: ''
      };
    }

    logout() {
      this.props.logout();
    }

    makeUserCard () {
      const { classes } = this.props;
      return (
        <React.Fragment>
          <Typography variant='display1' gutterBottom>
            Logged in as "{this.props.sessionStatus.user.username}"
          </Typography>
          <TextField
            disabled
            fullWidth
            className={classes.textField}
            value={this.props.sessionStatus.user.username}
            label="Username"/>
          <TextField
            disabled
            fullWidth
            className={classes.textField}
            value={this.props.sessionStatus.user.email}
            label="Email"/>
          <List>
            <ListSubheader style={{'paddingLeft': '0'}}>
              <Typography variant="subheading" gutterBottom>Access groups: </Typography>
            </ListSubheader>
            {this.props.sessionStatus.user.groups.map((group, i) =>
              <ListItem button key={i}>
                <Avatar>
                  <Group />
                </Avatar>
                <ListItemText primary={group} />
              </ListItem>
            )}
          </List>
          <Button variant="contained" style={{marginTop: '10px'}} id="cy-logout-btn" onClick={this.logout} color="primary">
            Logout
          </Button>
        </React.Fragment>
      );
    }

    submit = () => {
      if (this.state.username.length && this.state.password.length) {
        this.props.makeZigguratLoginRequest(this.state.username, this.state.password);
      }else {
        NotificationManager.warning(`Please provide a username and password before submitting login form.`, 'Warning', 10000);
      }
    };

    makeLoginForm () {
      const { classes } = this.props;
      return (
        <form>
          <Typography variant='display1' gutterBottom>
            Login
          </Typography>
          <Select
            id="cy-login-provider-select"
            className={classes.selectField}
            label="Login Authority"
            value={this.state.provider}
            onChange={
              (event, index) => this.setState({provider: event.target.value})}
            fullWidth>
            {
              PROVIDERS.map((provider, i) =>
                <MenuItem key={i} value={provider.provider_name}>
                  {provider.display_text}
                </MenuItem>
              )
            }
          </Select>
          <TextField
            id="cy-login-user-tf"
            className={classes.textField}
            label="Username"
            placeholder="Type your username"
            value={this.state.username}
            onChange={
              (event, value) => this.setState({username: event.target.value})}
            fullWidth />
          <TextField
            id="cy-login-password-tf"
            className={classes.textField}
            value={this.state.password}
            onChange={
              (event) => this.setState({password: event.target.value})}
            label="Password"
            placeholder="Type your password"
            type="password"
            fullWidth />
          <Button
            className={classes.button}
            variant="contained"
            id="cy-login-btn"
            onClick={this.submit}
            color="primary">
            Login
          </Button>
        </form>
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
)
