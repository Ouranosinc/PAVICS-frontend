import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
class ProcessesSelector extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    fetchProcesses: React.PropTypes.func.isRequired,
    fetchProcessInputs: React.PropTypes.func.isRequired,
    selectWpsProvider: React.PropTypes.func.isRequired,
    wpsProvider: React.PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.props.fetchProcesses(this.props.wpsProvider);
  }

  makeChooseProcessCallback (process) {
    return () => {
      this.props.chooseProcess(process);
      // TODO remove the boilerplate when api provides the identifier
      let processIdentifier;
      if (process.identifier) {
        processIdentifier = process.identifier;
      } else {
        let param = process.url.slice('process=');
        let bits = param.split('=');
        processIdentifier = bits.slice(-1)[0];
      }
      this.props.fetchProcessInputs(this.props.wpsProvider, processIdentifier);
    };
  }

  changeWPSprovider = (selectedKey) => {
    this.props.selectWpsProvider(selectedKey);
  };

  render () {
    return (
      <div>
        <Nav onSelect={this.changeWPSprovider}>
          <NavItem eventKey="emu_">Emu2</NavItem>
          <NavItem eventKey="flying">Flying</NavItem>
          <NavItem eventKey="emu_external">Emu external</NavItem>
        </Nav>
        {this.props.processes.map((process, i) => {
          return (
            <div onClick={this.makeChooseProcessCallback(process)} key={i}>
              <h3>{process.title}</h3>
              <p>{process.description}</p>
            </div>
          );
        })}
      </div>
    );
  }
}
export default ProcessesSelector;
