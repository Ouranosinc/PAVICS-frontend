import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
  CollapseNestedList: {

  }
});


export class CollapseNestedList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    rootListItemClass: PropTypes.string,
    rootListItemContent: PropTypes.object.isRequired,
    rootListItemStyle: PropTypes.object,
    children: PropTypes.array.isRequired // Array of MaterialUI ListItems
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render () {
    const { children, rootListItemClass, rootListItemContent, rootListItemStyle } = this.props;
    return (
      <React.Fragment>
        <ListItem button onClick={this.handleClick}
          className={rootListItemClass}
          style={rootListItemStyle}>
          {rootListItemContent}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CollapseNestedList);
