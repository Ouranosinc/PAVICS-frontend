import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as researchActionsCreators } from './../../redux/modules/Research';

export class Research extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
  }


  render () {
    var yolo = this.props;
    return (
      <div>
        <h1>Research</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    researchs: state.researchs
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Research)
