import React from 'react'
import { connect } from 'react-redux'
import {
  selectCatalogKey,
  selectCatalogValue,
  addCatalogKeyValue,
  removeCatalogKeyValue,
  fetchCatalogs,
  requestCatalogs,
  receiveCatalogsFailure,
  receiveCatalogs } from '../modules/Visualize'

import Visualize from './Visualize' //TODO: Figure out what to do with this

const mapActionCreators = {
  selectCatalogKey,
  selectCatalogValue,
  addCatalogKeyValue,
  removeCatalogKeyValue,
  fetchCatalogs,
  requestCatalogs,
  receiveCatalogsFailure,
  receiveCatalogs
};

const mapStateToProps = (state) => ({
  currentSelectedKey: state.currentSelectedKey,
  currentSelectedValue: state.currentSelectedValue,
  selectedFields: state.selectedFields,
  selectedDatasets: state.selectedDatasets,
  catalogs: state.catalogs
});

export default connect(mapStateToProps, mapActionCreators)(Visualize)
