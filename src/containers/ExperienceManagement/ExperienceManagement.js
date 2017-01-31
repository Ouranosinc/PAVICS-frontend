import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classes from './ExperienceManagement.scss';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
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
            <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
            <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
            <ListItem
              primaryText="Inbox"
              leftIcon={<ContentInbox />}
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText="Starred"
                  leftIcon={<ActionGrade />}
                />,
                <ListItem
                  key={2}
                  primaryText="Sent Mail"
                  leftIcon={<ContentSend />}
                  disabled={true}
                  nestedItems={[
                    <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                  ]}
                />,
                <ListItem
                  key={3}
                  primaryText="Inbox"
                  leftIcon={<ContentInbox />}
                  open={this.state.open}
                  onNestedListToggle={this.handleNestedListToggle}
                  nestedItems={[
                    <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                  ]}
                />,
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
