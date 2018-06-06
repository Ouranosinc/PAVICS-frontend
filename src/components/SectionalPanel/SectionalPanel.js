import React from 'react';
import classes from './SectionalPanel.scss';
import { SectionalMenu, SectionalContent } from './.';

class SectionalPanel extends React.Component {
  static propTypes = {
    goToSection: React.PropTypes.func.isRequired,
    section: React.PropTypes.string.isRequired,
    currentContent: React.PropTypes.object,
    currentTitle: React.PropTypes.string.isRequired,
    showContent: React.PropTypes.bool.isRequired,
    sessionManagement: React.PropTypes.object.isRequired,
    project: React.PropTypes.object.isRequired,
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
