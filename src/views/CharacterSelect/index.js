import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import store from '../../store';
import * as ls from '../../utils/localStorage';
import * as enums from '../../utils/destinyEnums';
import Spinner from '../../components/UI/Spinner';
import { BungieAuthMini } from '../../components/BungieAuth';
import ProfileSearch from '../../components/ProfileSearch';
import { ReactComponent as Logo } from '../../components/BraytechDevice.svg';

import ProfileError from './ProfileError';
import Profile from './Profile';

import './styles.css';

class CharacterSelect extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  characterClick = characterId => e => {
    const { membershipType, membershipId } = this.props.member;

    ls.set('setting.profile', { membershipType, membershipId, characterId });
  };

  handler_profileClick = (membershipType, membershipId, displayName) => async e => {
    window.scrollTo(0, 0);

    store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType, membershipId } });

    if (displayName) {
      ls.update('history.profiles', { membershipType, membershipId, displayName }, true, 9);
    }
  };

  resultsListItems = profiles => profiles.map((p, i) => (
    <li key={i} className='linked' onClick={this.handler_profileClick(p.membershipType, p.membershipId, p.displayName)}>
      <div className='icon'>
        <span className={`destiny-platform_${enums.platforms[p.membershipType]}`} />
      </div>
      <div className='displayName'>{p.displayName}</div>
    </li>
  ));

  render() {
    const { t, member, viewport, location } = this.props;
    const { error, loading } = member;

    const reverseUI = viewport.width <= 600;

    const savedProfile = ls.get('setting.profile') || {};

    const profileCharacterSelect = (
      <>
        {loading ? (
          <Spinner />
        ) : member.data ? (
          <>
            <div className='sub-header'>
              <div>{t(member && member.membershipId === savedProfile.membershipId ? 'Saved profile' : 'Active profile')}</div>
            </div>
            {member.data && <Profile member={member} onCharacterClick={this.characterClick} location={location} />}
          </>
        ) : null}
      </>
    );

    return (
      <div className={cx('view', { loading })} id='character-select'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Character Select')}</div>
          </div>
        </div>
        <div className='padder'>
          {reverseUI && profileCharacterSelect && !error ? (
            <div className='module profile'>
              <div className='device'>
                <Logo />
              </div>
              {profileCharacterSelect}
            </div>
          ) : null}
          <div className='module search'>
            {error && <ProfileError error={error} />}
            <div className='sub-header'>
              <div>{t('Bungie.net profile')}</div>
            </div>
            <BungieAuthMini />
            <ProfileSearch resultsListItems={this.resultsListItems} />
          </div>
          {!reverseUI && profileCharacterSelect && !error ? (
            <div className='module profile'>
              <div className='device'>
                <Logo />
              </div>
              {profileCharacterSelect}
            </div>
          ) : null}
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

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(CharacterSelect);
