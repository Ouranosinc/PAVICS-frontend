import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="btn-group btn-group-justified btn-group-raised">
              <Link to="/Gandalf" className="btn">Gandalf</Link>
              <Link to="/Visualize" className="btn">Visualize</Link>
              <Link to="/Workboard" className="btn">Workboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
