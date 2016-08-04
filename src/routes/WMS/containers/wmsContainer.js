import { connect } from 'react-redux'
import { fetchWms, saveCurrentWms } from '../modules/wms'

import wms from '../components/wms'

const mapActionCreators = {
  fetchWms,
  saveCurrentWms
}

const mapStateToProps = (state) => ({
  wms: state.wms.wmss.find(wms => wms.id === state.wms.current),
  saved: state.wms.wmss.filter(wms => state.wms.saved.indexOf(wms.id) !== -1)
})

export default connect(mapStateToProps, mapActionCreators)(wms)
