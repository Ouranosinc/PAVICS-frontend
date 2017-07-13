import React from 'react';
import classes from './SectionalPanel.scss';
import { SectionalMenu, SectionalContent } from './.';

class SectionalPanel extends React.Component {
  static propTypes = {
    // chooseStep: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    section: React.PropTypes.string.isRequired,
    currentContent: React.PropTypes.object,
    showContent: React.PropTypes.bool.isRequired
  };

  render () {
    return (
      <div className={classes['SectionalPanel'] + (this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
        <div className={(this.props.showContent) ? classes['Shown'] : classes['Hidden']}>
          <SectionalMenu
            section={this.props.section}
            goToSection={this.props.goToSection} />
          {/*chooseStep={this.props.workflowActions.chooseStep}*/}
          <SectionalContent
            showContent={this.props.showContent}
            currentContent={this.props.currentContent} />
        </div>
      </div>
    );
  }
}
export default SectionalPanel;
