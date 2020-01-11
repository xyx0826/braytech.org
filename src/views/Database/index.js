import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { DestinyKey } from '../../components/UI/Button';
import Items from '../../components/Items';

import './styles.css';

class Database extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }displayCategoryIndex

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, member, location, match } = this.props;
    const object = match.params?.object;
    const query = queryString.parse(location.search);

    const definitionVendor = manifest.DestinyVendorDefinition[3361454721];

    const lists = [];
    let s = [];

    definitionVendor.itemList.filter(i => i.displayCategoryIndex === 9).forEach(i => {

     
      
      if (s.length > 6) {
        lists.push(s)
        s = []
      }

      s.push(i)

      console.log({
        name: manifest.DestinyInventoryItemDefinition[i.itemHash]?.displayProperties?.name,
        ...i
      })
    })
    console.log(lists)


    
    return (
      <div className='view' id='database'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Database')}</div>
          </div>
        </div>
        <div className='buff'>
          <div className='module'>
            {lists.map(l => <ul className='list inventory-items'><Items items={l} /></ul>)}
          </div>
        </div>
      </div>
    );
  }  
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Database);
