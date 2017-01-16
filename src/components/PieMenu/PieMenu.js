import React from 'react';
import Plotly from 'plotly.js';
import { Glyphicon } from 'react-bootstrap';
import classes from './PieMenu.scss';

class PieMenu extends React.Component {
  static propTypes = {

  };

  constructor (props){
    super(props);
    /*this.state = {
      data: [{
        values: [20, 20, 20, 20, 20],
        labels: ['A', 'B', 'C', 'D', 'E'],
        'marker': {
          'colors': [
            'rgb(146, 123, 21)',
            'rgb(177, 180, 34)',
            'rgb(206, 206, 40)',
            'rgb(175, 51, 21)',
            'rgb(35, 36, 21)'
          ]
        },
        type: 'pie',
        hoverinfo: 'text',
        textinfo: 'text'
      }],
      layout: {
        showlegend: false,
        height: 300,
        width: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      }
    };
    this._bindRef = this._bindRef.bind(this);*/
    this._onClick = this._onClick.bind(this);
  }

  componentDidMount () {
    /*Plotly.plot(this.container, this.state.data, this.state.layout, {displayModeBar: false});*/
  }

  componentDidUpdate () {
    /*this.container.data = this.state.data;
    this.container.layout = this.state.layout;
    Plotly.redraw(this.container);
    Plotly.Plots.resize(this.container);
    this.container.on('plotly_click', this._onClick);*/
  }

  _onClick (event) {
    console.log(event);
  }

  _bindRef (node) {
    this.container = node;
  }

  render () {
    return (
      <div className={classes['PieMenu']}>
        {/*<div id="plotly" ref={this._bindRef}></div>*/}
        <nav className={classes['radialnav']}>
          <a href="#" className='ellipsis'><i className="fa fa-bars"></i></a>
          <ul className={classes['menu']}>
            <li data-submenu="home">
              <a href="#">
                <Glyphicon className={classes['CustomGlyphIcon']} glyph="book" />
              </a>
            </li>
            <li><a href="#"><Glyphicon className={classes['CustomGlyphIcon']} glyph="music" /></a></li>
            <li><a href="#"><Glyphicon className={classes['CustomGlyphIcon']} glyph="book" /></a></li>
            <li><a href="#"><Glyphicon className={classes['CustomGlyphIcon']} glyph="music" /></a></li>
            <li><a href="#"><Glyphicon className={classes['CustomGlyphIcon']}glyph="book" /></a></li>
          </ul>
        </nav>
      </div>
    );
  }
}
export default PieMenu;
