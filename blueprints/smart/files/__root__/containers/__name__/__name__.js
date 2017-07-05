import React from 'react';
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
      <div>
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
