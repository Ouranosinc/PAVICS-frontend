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
