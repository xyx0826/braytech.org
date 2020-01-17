import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import * as entities from 'entities';

import manifest from '../../utils/manifest';
import * as bungie from '../../utils/bungie';
import * as responseUtils from '../../utils/responseUtils';
import * as utils from '../../utils/destinyUtils';
import userFlair from '../../data/userFlair';
import store from '../../store';
import ObservedImage from '../ObservedImage';
import Spinner from '../UI/Spinner';
import { Button, DestinyKey } from '../UI/Button';
import Characters from '../UI/Characters';
import Flair from '../UI/Flair';
import Ranks from '../Ranks';

import './styles.css';

class MemberLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: {
        loading: true,
        data: false,
        error: false
      },
      all: {
        loading: false,
        data: false,
        error: false
      },
      overlay: false
    };

    this.membershipType = this.props.type;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    this.mounted = true;

    const { id, displayName = false } = this.props;

    if (this.mounted) {
      try {
        if (!this.membershipType) {
          let linkedProfilesResponse = await bungie.GetLinkedProfiles({
            params: {
              membershipId: id
            }
          });

          if (linkedProfilesResponse && linkedProfilesResponse.ErrorCode === 1) {
            const activeProfile = linkedProfilesResponse.Response.profiles?.find(p => p.crossSaveOverride === p.membershipType)
              ? linkedProfilesResponse.Response.profiles?.find(p => p.crossSaveOverride === p.membershipType)
              : linkedProfilesResponse.Response.profiles?.length &&
                Object.values(linkedProfilesResponse.Response.profiles).sort(function(a, b) {
                  return new Date(b.dateLastPlayed).getTime() - new Date(a.dateLastPlayed).getTime();
                })[0];

            this.membershipType = activeProfile.membershipType;
          } else {
          }
        }

        let response = await bungie.GetProfile({
          params: {
            membershipType: this.membershipType,
            membershipId: id,
            components: displayName ? '200' : '100,200'
          }
        });

        if (response && response.ErrorCode === 1) {
          let profile = responseUtils.profileScrubber(response.Response, 'activity');

          if (!profile.characters.data || (profile.characters.data && profile.characters.data.length === 0)) {
            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: true
              }
            }));
          } else {
            this.setState(p => ({
              ...p,
              basic: {
                ...p.basic,
                data: profile,
                loading: false,
                error: false
              }
            }));
          }
        } else {
          throw Error;
        }
      } catch (e) {}
    }
  }

  getFullProfileData = async () => {
    const { id } = this.props;

    if (this.mounted) {
      try {
        let requests = [
          bungie.GetProfile({
            params: {
              membershipType: this.membershipType,
              membershipId: id,
              components: '100,200,202,204,205,800,900'
            }
          }),
          bungie.GetGroupsForMember({
            params: {
              membershipType: this.membershipType,
              membershipId: id
            }
          })
        ];

        let [profile, group] = await Promise.all(requests);

        if (profile && profile.ErrorCode === 1) {
          profile = responseUtils.profileScrubber(profile.Response, 'activity');

          if (!profile.profileRecords.data || (profile.profileRecords.data && Object.entries(profile.profileRecords.data.records).length === 0)) {
            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: true
              }
            }));
          } else {
            let data = {
              ...profile,
              group: group && group.ErrorCode === 1 && group.Response.results.length ? group.Response.results[0].group : false
            };

            // console.log(data);

            this.setState(p => ({
              ...p,
              all: {
                ...p.all,
                error: false,
                data: data,
                loading: false
              }
            }));
          }
        } else {
          throw Error;
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  activateOverlay = async e => {
    if (this.props.disableOverlay || !(!this.state.basic.loading && this.state.basic.data)) return;

    e.stopPropagation();

    this.setState((prevState, props) => {
      prevState.overlay = true;
      return prevState;
    });

    this.getFullProfileData();
  };

  deactivateOverlay = e => {
    e.stopPropagation();

    if (this.mounted) {
      this.setState((prevState, props) => {
        prevState.overlay = false;
        return prevState;
      });
    }
  };

  handler_onCharacterClick = characterId => e => {
    store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: this.membershipType, membershipId: this.props.id, characterId: characterId } });
  }

  render() {
    const { t, id, displayName, characterId, hideFlair, showClassIcon, hideEmblemIcon } = this.props;

    let characterBasic;
    if (this.state.basic.data) {
      if (characterId) {
        characterBasic = this.state.basic.data.characters.data.find(c => c.characterId === characterId);
        if (!characterBasic) characterBasic = this.state.basic.data.characters.data[0];
      } else {
        characterBasic = this.state.basic.data.characters.data[0];
      }
    }

    const flair = userFlair.find(f => f.user === this.membershipType + id);
    const primaryFlair = flair && flair.trophies.find(t => t.primary);

    const memberLink = (
      <div className={cx('member-link', { wait: !(!this.state.basic.loading && this.state.basic.data) })} onClick={this.activateOverlay}>
        {!hideFlair && primaryFlair ? (
          <div className={cx('user-flair', primaryFlair.classnames)}>
            <i className={primaryFlair.icon} />
          </div>
        ) : null}
        <div className='emblem'>
          {!this.state.basic.loading && this.state.basic.data ? (
            showClassIcon ? (
              <div className='icon'>
                <i
                  className={`destiny-class_${utils
                    .classTypeToString(characterBasic.classType)
                    .toString()
                    .toLowerCase()}`}
                />
              </div>
            ) : !hideEmblemIcon ? (
              <ObservedImage className='image' src={`https://www.bungie.net${characterBasic.emblemPath || '/img/misc/missing_icon_d2.png'}`} />
            ) : null
          ) : null}
        </div>
        <div className='displayName'>{displayName ? displayName : !this.state.basic.loading && this.state.basic.data ? this.state.basic.data.profile.data.userInfo.displayName : null}</div>
      </div>
    );

    if (this.state.overlay && this.state.all.data) {
      const timePlayed = Math.floor(
        Object.keys(this.state.all.data.characters.data).reduce((sum, key) => {
          return sum + parseInt(this.state.all.data.characters.data[key].minutesPlayedTotal);
        }, 0) / 1440
      );

      const lastCharacterPlayedArr = Object.entries(this.state.all.data.characterActivities.data).sort((a, b) => {
        let x = new Date(a[1].dateActivityStarted).getTime();
        let y = new Date(b[1].dateActivityStarted).getTime();

        return y - x;
      });

      const lastCharacterPlayed = lastCharacterPlayedArr.length ? lastCharacterPlayedArr[0][0] : lastCharacterPlayedArr;
      const lastActivities = utils.lastPlayerActivity({ profile: { characters: this.state.all.data.characters, characterActivities: this.state.all.data.characterActivities } });

      return (
        <>
          {memberLink}
          <div id='member-overlay' className={cx({ error: this.state.all.error })}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className={cx('wrapper-inner')}>
                {!this.state.all.loading && this.state.all.data && !this.state.all.error ? (
                  <>
                    <div className='module'>
                      <div className='names'>
                        <div className='displayName'>{this.state.all.data.profile.data && this.state.all.data.profile.data.userInfo.displayName}</div>
                        <div className='groupName'>{this.state.all.data.group ? entities.decodeHTML(this.state.all.data.group.name) : null}</div>
                        <Flair type={this.membershipType} id={id} />
                      </div>
                      <div className='basics'>
                        <div>
                          <div className='name'>{t('Season rank')}</div>
                          <div className='value'>{utils.progressionSeasonRank({ characterId: lastCharacterPlayed, data: { profile: this.state.all.data } }).level}</div>
                        </div>
                        <div>
                          <div className='name'>{t('Time played across characters')}</div>
                          <div className='value'>
                            {timePlayed} {timePlayed === 1 ? t('day played') : t('days played')}
                          </div>
                        </div>
                        <div>
                          <div className='name'>{t('Triumph score')}</div>
                          <div className='value'>{this.state.all.data.profileRecords.data.score.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className='name'>{t('Collection total')}</div>
                          <div className='value'>{utils.collectionTotal(this.state.all.data).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className='module'>
                      <div className='sub-header'>
                        <div>{t('Characters')}</div>
                      </div>
                      <Characters member={{ data: { profile: this.state.all.data }, membershipId: id, membershipType: this.membershipType, characterId: lastCharacterPlayed }} characterClick={this.handler_onCharacterClick} mini />
                    </div>
                    <div className='module'>
                      <div className='sub-header'>
                        <div>{t('Ranks')}</div>
                      </div>
                      <div className='ranks'>
                        {[2772425241, 2626549951, 2000925172].map(hash => {
                          return <Ranks key={hash} mini data={{ membershipType: this.membershipType, membershipId: id, characterId: lastCharacterPlayed, characters: this.state.all.data.characters.data, characterProgressions: this.state.all.data.characterProgressions.data, characterRecords: this.state.all.data.characterRecords.data, profileRecords: this.state.all.data.profileRecords.data.records }} hash={hash} />;
                        })}
                      </div>
                    </div>
                  </>
                ) : this.state.all.error ? (
                  <>
                    <div>
                      <div className='icon'>
                        <ObservedImage className='image' src='/static/images/extracts/ui/010A-00000552.PNG' />
                      </div>
                    </div>
                    <div>
                      <div className='text'>
                        <div className='name'>{t('Private profile')}</div>
                        <div className='description'>{t('This user has their profile privacy set to private')}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
              <div className='sticky-nav mini ultra-black'>
                <div className='sticky-nav-inner'>
                  <div />
                  <ul>
                    <li>
                      <Button action={this.deactivateOverlay}>
                        <DestinyKey type='dismiss' /> {t('Dismiss')}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.state.overlay && this.state.basic.data) {
      return (
        <>
          {memberLink}
          <div id='member-overlay' className={cx({ error: this.state.all.error })}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className={cx('wrapper-inner')}>
                {this.state.all.error ? (
                  <>
                    <div>
                      <div className='icon'>
                        <ObservedImage className='image' src='/static/images/extracts/ui/010A-00000552.PNG' />
                      </div>
                    </div>
                    <div>
                      <div className='text'>
                        <div className='name'>{t('Private profile')}</div>
                        <div className='description'>{t('This user has their profile privacy set to private')}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
              <div className='sticky-nav mini ultra-black'>
                <div className='sticky-nav-inner'>
                  <div />
                  <ul>
                    <li>
                      <Button action={this.deactivateOverlay}>
                        <DestinyKey type='dismiss' /> {t('Dismiss')}
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.state.basic.data) {
      return memberLink;
    } else {
      return memberLink;
    }
  }
}

export default compose(withTranslation())(MemberLink);
