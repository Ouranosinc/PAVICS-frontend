import React from 'react';
import PropTypes from 'prop-types';
import classes from './SectionalPanel.scss';
import { SectionalMenu, SectionalContent } from './.';

class SectionalPanel extends React.Component {
  static propTypes = {
    goToSection: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    currentContent: PropTypes.object,
    currentTitle: PropTypes.string.isRequired,
    showContent: PropTypes.bool.isRequired,
    sessionManagement: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div className={classes['SectionalPanel'] + (this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
        <div className={(this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
          <SectionalMenu
            section={this.props.section}
            goToSection={this.props.goToSection}
            sessionManagement={this.props.sessionManagement}
            project={this.props.project}/>
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
