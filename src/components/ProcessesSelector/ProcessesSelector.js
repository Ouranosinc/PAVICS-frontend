import React from 'react';
class ProcessesSelector extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired
  }
  render () {
    return (
      <div>
        {this.props.processes.map((process, i) => {
          return (
            <div key={i}>
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
