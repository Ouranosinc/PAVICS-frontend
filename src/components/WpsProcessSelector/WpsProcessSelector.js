import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import classes from '../WorkflowWizard/WorkflowWizard.scss';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
class WpsProcessSelector extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    fetchProviders: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    providers: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this.props.fetchProviders();
    if (this.props.providers.selectedProvider) {
      this.props.fetchProcesses(this.props.providers.selectedProvider);
    }
  }

  makeChooseProcessCallback (process) {
    return () => {
      this.props.chooseProcess(process);
      // TODO remove the boilerplate when api provides the identifier
      // TODO duplicated in module/pavics to make executing easier
      let processIdentifier;
      if (process.identifier) {
        processIdentifier = process.identifier;
      } else {
        let param = process.url.slice('process=');
        let bits = param.split('=');
        processIdentifier = bits.slice(-1)[0];
      }
      this.props.fetchProcessInputs(this.props.providers.selectedProvider, processIdentifier);
    };
  }

  changeWPSprovider = (selectedKey) => {
    this.props.selectWpsProvider(this.props.providers.items[selectedKey].identifier);
  };

  render () {
    return (
      <div className={classes.WorkflowWizard}>
        <Nav onSelect={this.changeWPSprovider}>
          {
            this.props.providers.items.map((provider, i) => <NavItem key={i} eventKey={i}>{provider.title}</NavItem>)
          }
        </Nav>
        {this.props.processes.map((process, i) => {
          return (
            <Card>
              <CardHeader
                title={process.title} />
              <CardText>{process.description}</CardText>
              <CardActions>
                <FlatButton
                  label="Execute Process"
                  onClick={this.makeChooseProcessCallback(process)} />
              </CardActions>
            </Card>
          );
        })}
      </div>
    );
  }
}
export default WpsProcessSelector;
