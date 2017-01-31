import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classes from './ExperienceManagement.scss';
import {List, ListItem} from 'material-ui/List';
import Folder from 'material-ui/svg-icons/file/folder-open';
import File from 'material-ui/svg-icons/editor/insert-drive-file';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

export class ExperienceManagement extends React.Component {
  static propTypes = {
    currentProjectDatasets: React.PropTypes.array.isRequired
  }

  state = {
    open: false
  };

  constructor(props) {
    super(props);
  }

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open
    });
  };

  render () {
    return (
      <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
        <Paper>
          <List>
            <Subheader>Project datasets</Subheader>
            {this.props.currentProjectDatasets.map((dataset, i) => {
              return (
                <ListItem
                  key={i}
                  primaryText="Inbox"
                  leftIcon={<Folder />}
                  initiallyOpen={false}
                />
              );
            })}
            <ListItem
              primaryText="Inbox"
              leftIcon={<Folder />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[/*
                this.props.currentProjectDatasets.map((dataset, i) => {
                  return (
                    <ListItem
                      key={i}
                      primaryText={dataset.dataset_id}
                      leftIcon={<File />}
                    />
                  );
                }),*/
              ]}
            />
          </List>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}
const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperienceManagement);
