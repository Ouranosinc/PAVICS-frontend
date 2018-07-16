import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import { SectionalMenu, SectionalContent } from './.';

class SectionalPanel extends React.Component {
  static propTypes = {
    currentContent: PropTypes.object,
    currentTitle: PropTypes.string.isRequired,
    section: PropTypes.object.isRequired,
    sectionActions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    showContent: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes['SectionalPanel'] + (this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
        <div className={(this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
          <SectionalMenu
            section={this.props.section}
            sectionActions={this.props.sectionActions}
            session={this.props.session}
            project={this.props.project} />
          <SectionalContent
            showContent={this.props.showContent}
            title={this.props.currentTitle}
            currentContent={this.props.currentContent} />
        </div>
      </div>
    );
  }
}
export default SectionalPanel;
