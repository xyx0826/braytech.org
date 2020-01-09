import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import queryString from 'query-string';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import AddPlayer from './AddPlayer';
import PlayerHistory from './PlayerHistory';

import './styles.css';

const nightfallDisplayHashes = orderBy(Object.keys(enums.nightfalls), [key => enums.nightfalls[key].sort], ['asc']);

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
  }

  handler_removePlayer = membershipId => e => {
    if (this.mounted) {
      this.setState(p => ({
        ...p,
        members: p.members.filter(m => m.membershipId !== membershipId)
      }));
    }
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, location } = this.props;
    const query = queryString.parse(location.search);
    const members = query.members?.split('|').map(m => {
      const pizza = m.split(':');

      return {
        membershipType: pizza[0],
        membershipId: pizza[1]
      }
    }) || [];

    return (
      <div className='view' id='speed-runs'>
        <div className='data'>
          <div className='column nightfalls'>
            <ul className='list member'>
              <li />
            </ul>
            <ul className='list'>
              {nightfallDisplayHashes.map(key => (
                <li key={key} className='row'>
                  {manifest.DestinyActivityDefinition[key].selectionScreenDisplayProperties.name}
                </li>
              ))}
            </ul>
            <ul className='list sums'>
              <li className='row'>
                <div className='text'>
                  <div className='name'>{t('Total duration')}</div>
                  {/* <div className='description'>
                    <p>{t('Sum activity duration where all current scored nightfall activities are included.')}</p>
                  </div> */}
                </div>
              </li>
              <li className='row'>
                <div className='text'>
                  <div className='name'>{t('After the Nightfall duration')}</div>
                  {/* <div className='description'>
                    <p>{t('Sum activity duration where nightfalls available to most players between Forsaken and Shadowkeep are included.')}</p>
                  </div> */}
                </div>
              </li>
            </ul>
          </div>
          {members.map(m => <PlayerHistory key={m.membershipId} {...m} order={nightfallDisplayHashes} action={this.handler_removePlayer} query={members} />)}
          {members.length < 5 ? <AddPlayer action={this.handler_addPlayer} query={members} /> : null}
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

export default compose(connect(mapStateToProps), withTranslation())(CompareNightfalls);
