import React from 'react'
import Table, {TableHeader, SelectableTableRow} from '../../components/Table';
import tableClasses from './../../components/Table/Table.scss';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import {List, ListItem} from 'material-ui/List';
import AddFilter from 'material-ui/svg-icons/image/add-to-photos';
import SearchInput from './SearchInput';

class CriteriaSelection extends React.Component {
  static propTypes = {
    criteriaName: React.PropTypes.string.isRequired,
    variables: React.PropTypes.object.isRequired,
    selectedFacets: React.PropTypes.array.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeFacetKeyValue: React.PropTypes.func.isRequired,
    fetchEsgfDatasets: React.PropTypes.func.isRequired,
    fetchPavicsDatasets: React.PropTypes.func.isRequired
  };

  state = {
    open: false
  };

  constructor (props) {
    super(props);
    this._onSelectRow = this._onSelectRow.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this.state = {
      inputContent: ''
    };
  }

  _handleRequestDelete () {
    alert('You clicked the delete button.');
  }

  _onSelectRow (event) {
    if (event.target.checked) {
      this.props.addFacetKeyValue(this.props.criteriaName, event.target.value);
    }
    else {
      this.props.removeFacetKeyValue(this.props.criteriaName, event.target.value);
    }
    // this.props.fetchEsgfDatasets();
    this.props.fetchPavicsDatasets();
  }

  _formatRows () {
    let vars = [];
    if (this.state.inputContent.length > 0) {
      vars = this.props.variables.values.filter((value) => {
        return value.toLowerCase().indexOf(this.state.inputContent.toLowerCase()) !== -1;
      });
    } else {
      vars = this.props.variables.values;
    }
    return vars.map((value) => {
      return [
        value
      ];
    });
  }

  _onInputChange (event) {
    var value = event.target.value;
    this.setState({inputContent: value});
  }

  render () {
    let headers = [
      this.props.criteriaName,
      <SearchInput onChangeCb={this._onInputChange} />,
    ];
    return (
      <div className="col-md-6 col-lg-6">
        <List>
          <ListItem
            nestedListStyle={{
              position: 'absolute', zIndex: '9999', width: '100%', maxHeight: '150px', overflowY: 'scroll', opacity: '1',
              background: 'white', transform: 'scaleY(1)', transformOrigin: 'left top 0px',
              transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
              boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
              borderRadius: '2px'}}
            primaryText="Model"
            leftIcon={<AddFilter />}
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem
                key={1}
                primaryText="Starred"
                leftCheckbox={<Checkbox />}
              />,
              <ListItem
                key={2}
                primaryText="Sent Mail"
                leftCheckbox={<Checkbox />}
              />,
              <ListItem
                key={3}
                primaryText="Inbox"
                leftCheckbox={<Checkbox />}
              />
            ]}
          />
        </List>
        <Chip
          onRequestDelete={this._handleRequestDelete}
          style={{marginBottom: '5px', width: '100%'}}
          labelStyle={{width: '95%'}}>
          Model XyZ
        </Chip>
        <Chip
          onRequestDelete={this._handleRequestDelete}
          style={{marginBottom: '5px', width: '45%'}}
          labelStyle={{width: '95%'}}>
          Model XyZ fdf  fds fsd  fds gr
        </Chip>
        <Chip
          onRequestDelete={this._handleRequestDelete}
          style={{marginBottom: '5px', width: '45%'}}
          labelStyle={{width: '95%'}}>
          Model XyZ fdsf
        </Chip>
      </div>
    /* <div>
        <Table>
          <TableHeader fields={headers}/>
          <tbody className={tableClasses['overflowable']}>
          {
            this._formatRows().map((row, i) => {
              let checked = false;
              this.props.selectedFacets.map(x => {
                if (x.value === row[0]) {
                  checked = true;
                }
              });
              return (
                <SelectableTableRow
                  key={i}
                  checked={checked}
                  value={row[0]}
                  onChangeCb={this._onSelectRow}
                  fields={row}/>
              );
            })
          }
          </tbody>
        </Table>
      </div>*/
    );
  }
}
export default CriteriaSelection;
