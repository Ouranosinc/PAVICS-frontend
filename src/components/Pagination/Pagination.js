import React, {Component} from 'react';
import {IconButton, MenuItem, SelectField} from 'material-ui';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

const styles = {
  pagination: {
    borderTop: '1px solid rgb(224, 224, 224)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  elements: {
    display: 'flex',
    alignItems: 'center',
    height: 56,
    marginLeft: 16
  },
  pageSelect: {
    marginLeft: 0
  },
  label: {
    color: '#999',
    fontWeight: 300,
    fontSize: 12
  },
  select: {
    width: 100,
    textAlign: 'right'
  },
  underline: {
    display: 'none'
  }
};

class Pagination extends Component {
  static defaultProps = {
    total: 0,
    perPageOptions: [10],
    texts: {
      page: 'Page: ',
      perPageOptions: 'Per Page: ',
      showing: 'Showing {from} to {to} of {total}'
    },
    initialPerPageOptionIndex: 0
  };
  static propTypes = {
    onChange: React.PropTypes.func,
    total: React.PropTypes.number.isRequired,
    perPageOptions: React.PropTypes.array,
    texts: React.PropTypes.shape({
      page: React.PropTypes.string.isRequired,
      perPageOptions: React.PropTypes.string.isRequired,
      showing: React.PropTypes.string.isRequired
    }),
    toFrom: React.PropTypes.any,
    initialPerPageOptionIndex: React.PropTypes.number
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      selectedPerPageOptionIndex: this.props.initialPerPageOptionIndex,
      currentPageIndex: 1
    };
    this.handleChangePerPage = this.handleChangePerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage (page) {
    this.setState({
      currentPageIndex: page
    });
    this.onChange(page, this.props.perPageOptions[this.state.selectedPerPageOptionIndex]);
  }

  handleChangePerPage (perPage) {
    let maxPage = Math.ceil(this.props.total / this.props.perPageOptions[perPage]);
    let newPageIndex = this.state.currentPageIndex;
    if (newPageIndex > maxPage) {
      newPageIndex = maxPage;
    }
    this.setState({
      selectedPerPageOptionIndex: perPage,
      currentPageIndex: newPageIndex
    });
    this.onChange(newPageIndex, this.props.perPageOptions[perPage]);
  }

  onChange (currPage, perPage) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(currPage, perPage);
    }
  }
  getToFromText () {
    if (typeof this.props.toFrom === 'function') {
      return this.props.toFrom(this.state.currentPageIndex, this.props.perPageOptions[this.state.selectedPerPageOptionIndex]);
    } else {
      let to = this.state.currentPageIndex * this.props.perPageOptions[this.state.selectedPerPageOptionIndex];
      if (to > this.props.total) {
        to = this.props.total;
      }
      let from = ((this.state.currentPageIndex - 1) * this.props.perPageOptions[this.state.selectedPerPageOptionIndex]) + 1;
      if (from > to) {
        from = to;
      }
      return {to, from};
    }
  }

  render () {
    let { total, texts, perPageOptions } = this.props;
    let { selectedPerPageOptionIndex, currentPageIndex } = this.state;
    let pages = [];
    let count = Math.ceil(total / perPageOptions[selectedPerPageOptionIndex]);

    for (var j = 1; j <= count; j++) {
      pages.push(j);
    }

    let {to, from} = this.getToFromText();

    let showing = texts.showing.replace('{total}', total)
      .replace('{from}', from)
      .replace('{to}', to);

    return (
      <div style={styles.pagination}>
        <div style={Object.assign({}, styles.elements, styles.pageSelect)}>
          <div style={styles.label}>{`${texts.page} `}</div>
          <SelectField
            onChange={(e, idx, page) => this.handleChangePage(page)}
            value={currentPageIndex}
            style={styles.select}
            underlineStyle={styles.underline}>
            {
              pages.map(page => (
                <MenuItem
                  primaryText={page}
                  value={page}
                  key={`page-${page}`} />
              ))
            }
          </SelectField>
        </div>
        <div style={styles.elements}>
          <div style={styles.label}>{`${texts.perPageOptions} `}</div>
          <SelectField
            onChange={(e, idx, selectedOption) => this.handleChangePerPage(selectedOption)}
            value={selectedPerPageOptionIndex}
            style={styles.select}
            underlineStyle={styles.underline}>
            {
              perPageOptions.map((v, i)=>{
                return <MenuItem key={i} value={i} primaryText={v} />;
              })
            }
          </SelectField>
        </div>
        <div style={styles.elements}>
          <div style={styles.label}>{`${showing}`}</div>
          <IconButton
            disabled={currentPageIndex === 1}
            onTouchTap={e => this.handleChangePage(currentPageIndex - 1, e)}>
            <ChevronLeft />
          </IconButton>
          <IconButton
            disabled={currentPageIndex === count}
            onTouchTap={e => this.handleChangePage(currentPageIndex + 1, e)}>
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default Pagination;
