import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export class <%= pascalEntityName %> extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <React.Fragment>
        <h1><%= pascalEntityName %></h1>
      </div>
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
)(<%= pascalEntityName %>)
