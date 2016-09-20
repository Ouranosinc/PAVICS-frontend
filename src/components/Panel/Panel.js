import React from 'react'
import style from './Panel.scss'
class Panel extends React.Component {
  render()
  {
    return (
      <div className={style['Panel']}>
        {this.props.children}
      </div>
    );
  }
}
export default Panel
