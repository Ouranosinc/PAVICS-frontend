import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  OLBBoxSelector: {

  }
});


export class OLBBoxSelector extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <div className={this.props.classes['OLBBoxSelector']}>
        <h1>OLBBoxSelector</h1>
      </div>
    )
  }
}

export default withStyles(styles)(OLBBoxSelector);
