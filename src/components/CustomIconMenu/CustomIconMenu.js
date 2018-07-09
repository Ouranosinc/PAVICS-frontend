import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import IconButton from'@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  CustomIconMenu: {

  }
});

/*
 CustomIconMenu Component encapsulate anchor element and open/close generic events of such actions menu
 Pass any number of MenuItem(s) with any kind of handlers as children
 Should be used in most one-level lists containing IconButton actions menu
 Do not use in nested list since calling current methods(mostly onMenuClosed()) from parent with onRef strategy will be a nightmare to manage
 See ProjectSearchCriterias component for a taste
 FIXME: Ideally onMenuClosed() should be called after any children MenuItem.onClick event
 */
export class CustomIconMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRef: PropTypes.func,
    menuItems: PropTypes.array.isRequired,
    iconButtonClass: PropTypes.string,
    menuClass: PropTypes.string,
    menuId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchor: null
    }
  }

  componentDidMount() {
    // Expose Component methods externally
    if (this.props.onRef) this.props.onRef(this)
  }
  componentWillUnmount() {
    if (this.props.onRef) this.props.onRef(undefined)
  }

  onMenuClosed = event => {
    this.setState({ anchor: null });
    if(event) event.stopPropagation();
  };

  onMenuClicked = event => {
    this.setState({ anchor: event.currentTarget });
    event.stopPropagation();
  };

  render () {
    const { anchor } = this.state;
    const { iconButtonClass, menuClass, menuId, menuItems } = this.props;
    return (
      <div className={this.props.classes['CustomIconMenu']}>
        <IconButton
          className={iconButtonClass}
          aria-label="Actions"
          aria-owns={anchor ? menuId : null}
          aria-haspopup="true"
          onClick={this.onMenuClicked}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={menuId}
          className={menuClass}
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={this.onMenuClosed}
          PaperProps={{
            style: {
              width: 200
            },
          }}>
          {menuItems}
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)(CustomIconMenu);
