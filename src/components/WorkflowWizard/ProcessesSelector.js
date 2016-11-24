import React from 'react';
import {ExecuteButton} from './';
class ProcessesSelector extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired,
    chooseProcess: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired
  }

  makeChooseProcessCallback (process) {
    return () => {
      this.props.chooseProcess(process);
    };
  }

  render () {
    return (
      <div>
        {this.props.processes.map((process, i) => {
          return (
            <div onClick={this.makeChooseProcessCallback(process)} key={i}>
              <h3>{process.title}</h3>
              <p>{process.description}</p>
            </div>
          );
        })}
        <ExecuteButton executeProcess={this.props.executeProcess} />
      </div>
    );
  }
}
export default ProcessesSelector;
