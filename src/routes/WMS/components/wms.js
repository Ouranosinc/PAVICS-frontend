
import React from 'react'
import classes from './wms.scss'

export const wms = (props: Props) => (
  <div>
    <div>
      <div className="form-group">
        <label for="datasets">Datasets: </label>
        <select className="form-control" id="datasets">
          { props.wms ?
            props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"].map(layer =>
            <option key={layer["Title"]}>
              {layer["Title"]}
            </option>
            ) : null
          }
        </select>
      </div>
      <h2 className={classes.wmsHeader}>
        {
          props.wms ? props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"].length : ''
        }
      </h2>
      <button className='btn btn-default' onClick={props.fetchwms}>
        Fetch datasets
      </button>
      {' '}
      {/*<button className='btn btn-default' onClick={props.saveCurrentwms}>
        Save
      </button>*/}
    </div>
    { /*props.saved.length
      ? <div className={classes.savedWisdoms}>
        <h3>
          Saved wisdoms
        </h3>
        <ul>
          {props.saved.map(wms =>
            <li key={wms.id}>
              {wms.value}
            </li>
          )}
        </ul>
      </div>
      : null*/
    }
  </div>
)

wms.propTypes = {
  wms: React.PropTypes.object,
  saved: React.PropTypes.array.isRequired,
  fetchwms: React.PropTypes.func.isRequired,
  saveCurrentwms: React.PropTypes.func.isRequired
}

export default wms
