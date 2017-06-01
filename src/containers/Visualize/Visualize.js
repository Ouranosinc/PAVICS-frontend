import React from 'react';
import { connect } from 'react-redux';
import { Visualize }from './../../components/Visualize';

export class VisualizeContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <Visualize {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizeContainer)
