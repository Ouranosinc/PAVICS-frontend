import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from'@material-ui/core/Checkbox';
import Chip from'@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import List from'@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddFilter from '@material-ui/icons/AddToPhotos';
import { Col } from 'react-bootstrap';

const styles = theme => ({
  icon: {
    color: theme.palette.secondary.light
  },
});

class CriteriaSelection extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    criteriaName: PropTypes.string.isRequired,
    variables: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    researchActions: PropTypes.object.isRequired,
    fetchDatasets: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      inputContent: '',
      isNestedOpen: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  handleClickOutside = (event) => {
    // If clicking outside the popover when its open, close it
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.isNestedOpen) {
        this.setState({ isNestedOpen: false});
      }
    }
  };

  onRemoveFacet = (facet) => {
    this.props.researchActions.removeFacetKeyValuePair(facet.key, facet.value);
    this.props.fetchDatasets();
  };

  onSelectRow = (event, checked, value) => {
    if (checked) {
      this.props.researchActions.addFacetKeyValuePair(this.props.criteriaName, value);
    } else {
      this.props.researchActions.removeFacetKeyValuePair(this.props.criteriaName, value);
    }
    this.props.fetchDatasets();
  };

  onToggleNestedList = () => {
    this.setState({ isNestedOpen: !this.state.isNestedOpen});
  }

  render () {
    return (
      <Col sm={12} md={6} lg={6}>
        <div ref={this.setWrapperRef}>
          <List id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}-list`}
                component="nav">
            <ListItem
              button onClick={() => this.onToggleNestedList()}
              id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}`}>
              <ListItemIcon className={(this.state.isNestedOpen)? this.props.classes.icon : ""}><AddFilter /></ListItemIcon>
              <ListItemText inset  primary={this.props.criteriaName.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase())} />
              <Collapse in={this.state.isNestedOpen} timeout="auto" unmountOnExit>
                <List style={{
                  top: '48px', right: '0', position: 'absolute', zIndex: '9999', width: '100%', maxHeight: '200px', overflowY: 'scroll',
                  opacity: '1', background: 'white', transform: 'scaleY(1)', transformOrigin: 'left top 0px',
                  transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                  boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'}}>
                  {
                    (this.props.variables && this.props.variables.values.length)?
                      this.props.variables.values.map((variable, i) => {let checked = false;
                        const exists = this.props.research.selectedFacets.filter(x => x.value === variable.value);
                        if(exists.length) checked = true;
                        return (
                          <ListItem
                            button
                            onClick={(event) => this.onSelectRow(event, !checked, variable.value)}
                            id={`cy-search-facet-${this.props.criteriaName.toLowerCase()}-${variable.value}`}
                            key={i}>
                            <Checkbox checked={checked} />
                            <ListItemText inset  primary={`${variable.value} (${variable.count})`} />
                          </ListItem>);
                      }): null
                  }
                </List>
              </Collapse>
            </ListItem>
          </List>
        </div>
        <div>
          {
            this.props.research.selectedFacets.map((x, i) =>
              x.key === this.props.criteriaName &&
              <Chip
                key={i + 1}
                onDelete={() => this.onRemoveFacet(x)}
                style={{margin: '0 5px 5px 0'}}
                label={x.value} />
            )
          }
        </div>
      </Col>
    );
  }
}
export default withStyles(styles)(CriteriaSelection);
