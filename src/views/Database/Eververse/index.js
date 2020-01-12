import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { DestinyKey } from '../../../components/UI/Button';
import Items from '../../../components/Items';

import './styles.css';

function project(itemList, weekTotalCeiling) {
  const weeks = [];

  let week = [];
  let weekTotal = 0;
  let classSet = 0;

  itemList.forEach((i, k) => {
    week.push(i);
    weekTotal++;

    const nextIsClassItem = (itemList[k] && manifest.DestinyInventoryItemDefinition[itemList[k].itemHash]?.classType > -1 && manifest.DestinyInventoryItemDefinition[itemList[k].itemHash]?.classType < 3) || (itemList[k] && ['Titan', 'Hunter', 'Warlock'].filter(test => manifest.DestinyInventoryItemDefinition[itemList[k].itemHash].itemTypeDisplayName.indexOf(test) > -1).length);

    console.log(`classSet: ${classSet}`);
    if (nextIsClassItem) {
      console.log(`Next item is a class item: ${manifest.DestinyInventoryItemDefinition[itemList[k].itemHash].displayProperties.name}`);

      if (classSet === 0) {
        classSet = 3;
        weekTotal = weekTotal - 2;
      }
    }

    if (classSet > 0) {
      classSet--;
    }

    if (weekTotal === weekTotalCeiling) {
      weeks.push(week);

      console.log(`Week: ${weeks.length + 1}`);

      week = [];
      weekTotal = 0;
    }
  });

  console.log(weeks);

  return weeks;
}

class Database extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, member } = this.props;

    const definitionVendor = manifest.DestinyVendorDefinition[3361454721];
    // console.log(definitionVendor);
    
    const weeks_featuredSilverItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 3), 6);
    const weeks_brightDustItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 9), 7);
    const weeks_featuredBrightDustItems = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 4).slice(3), 4);
    const weeks_brightDustConsumables = project(definitionVendor.itemList.filter(i => i.displayCategoryIndex === 10).slice(3), 4);

    return (
      <>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Database')}</div>
            <div className='name'>{manifest.DestinyFactionDefinition[1393733616].displayProperties.name}</div>
          </div>
        </div>
        <div className='buff'>
          {this.props.nav}
          <div className='module'>
            <div className='text'>
              <p>This view details each of the current season's weekly Eververse store stock.</p>
              <p>Its data comes directly from the API manifest's definition of <em>Tess Everis</em> and is displayed by merely itterating over it.</p>
            </div>
          </div>
          <div className='module'>
            <ul className='list weeks'>
              {weeks_brightDustItems.map((w, n) => (
                <li key={n}>
                  <ul>
                    <li>{t('Week {{weekNumber}}', { weekNumber: n + 1 })}</li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Featured silver items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        <Items items={weeks_featuredSilverItems[n].filter(i => i.itemHash !== 827183327)} />
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Featured bright dust items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        <Items items={weeks_featuredBrightDustItems[n]} />
                      </ul>
                    </li>
                  </ul>
                  <ul>
                    <li className='category'>{t('Bright dust items')}</li>
                    <li>
                      <ul className='list inventory-items'>
                        <Items items={[...w, ...weeks_brightDustConsumables[n]]} />
                      </ul>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
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
