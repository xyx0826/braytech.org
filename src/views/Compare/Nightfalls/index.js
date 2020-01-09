import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import AddPlayer from './AddPlayer';
import PlayerHistory from './PlayerHistory';

import './styles.css';

const nightfallDisplayHashes = orderBy(Object.keys(enums.nightfalls), [key => enums.nightfalls[key].sort], ['asc']);

function getItemsPerPage(width) {
  if (width >= 1600) return 5;
  if (width >= 1400) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  if (width < 768) return 1;
  return 1;
}

class CompareNightfalls extends React.Component {
  state = {};

  handler_addPlayer = (membershipType, membershipId) => {
    if (this.mounted) {
      this.setState(p => ({
        ...p,
        members: [
          ...p.members,
          {
            membershipType,
            membershipId
          }
        ]
      }));
    }
  };

  handler_removePlayer = membershipId => e => {
    if (this.mounted) {
      this.setState(p => ({
        ...p,
        members: p.members.filter(m => m.membershipId !== membershipId)
      }));
    }
  };

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, location } = this.props;
    const query = queryString.parse(location.search);
    const members =
      query.members?.split('|').map(m => {
        const pizza = m.split(':');

        return {
          membershipType: pizza[0],
          membershipId: pizza[1]
        };
      }) || [];
    
    const itemsPerPage = getItemsPerPage(viewport.width);

    return (
      <div className='view' id='speed-runs'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Compare')}</div>
            <div className='name'>{t('Nightfalls')} // beta 🎉</div>
          </div>
        </div>
        <div className={cx('padder', 'cols-' + itemsPerPage)}>
          <div className='data'>
            <div className='column nightfalls'>
              <ul className='list member'>
                <li />
              </ul>
              <ul className='list'>
                {nightfallDisplayHashes.map(key => (
                  <li key={key} className='row'>
                    <div className='text tooltip' data-hash={key} data-table='DestinyActivityDefinition'>{manifest.DestinyActivityDefinition[key].selectionScreenDisplayProperties.name}</div>
                  </li>
                ))}
              </ul>
              <ul className='list sums'>
                <li className='row'>
                  <div className='text'>
                    {t('Total duration')}
                    {/* <div className='description'>
                    <p>{t('Sum activity duration where all current scored nightfall activities are included.')}</p>
                  </div> */}
                  </div>
                </li>
                <li className='row'>
                  <div className='text'>
                    {t('After the Nightfall duration')}
                    {/* <div className='description'>
                    <p>{t('Sum activity duration where nightfalls available to most players between Forsaken and Shadowkeep are included.')}</p>
                  </div> */}
                  </div>
                </li>
              </ul>
            </div>
            {members.map(m => (
              <PlayerHistory key={m.membershipId} {...m} order={nightfallDisplayHashes} action={this.handler_removePlayer} query={members} />
            ))}
            {members.length < itemsPerPage ? <AddPlayer action={this.handler_addPlayer} query={members} /> : null}
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(CompareNightfalls);
