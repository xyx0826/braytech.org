import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';
import html2canvas from 'html2canvas';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import { enumerateRecordState, sealImages } from '../../utils/destinyEnums';
import ObservedImage from '../../components/ObservedImage';
import Button from '../../components/UI/Button';
import packageJSON from '../../../package.json';

import './styles.css';
import './header-note.css';
import './footer-note.css';
import './basics.css';
import './characters.css';
import './triumphs.css';

class Legend extends React.Component {
  constructor() {
    super();

    this.state = {};

    this.ref_page = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_print = () => {
    html2canvas(this.ref_page.current, { backgroundColor: null, scale: 2 }).then(canvas => {
      canvas.toBlob(async blob => {
        const url = await URL.createObjectURL(blob);
        console.log(url);
        window.open(url);
      });
    });
  };

  render() {
    const { t, member } = this.props;

    if (member && member.data) {
      const characters = member.data.profile.characters.data;
      const character = characters.find(c => c.characterId === member.characterId);
      const profileRecords = member.data.profile.profileRecords.data.records;
      const characterRecords = member.data.profile.characterRecords.data;
      const groups = member.data.groups.results;

      console.log(member);

      const timePlayed = Math.floor(
        Object.keys(member.data.profile.characters.data).reduce((sum, key) => {
          return sum + parseInt(member.data.profile.characters.data[key].minutesPlayedTotal);
        }, 0) / 1440
      );

      const infamySeasons = [{ recordHash: 3901785488, objectiveHash: 4210654397 }].map(season => {
        const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

        const recordScope = definitionRecord.scope || 0;
        const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

        season.resets = (recordData && recordData.objectives && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash) && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash).progress) || 0;

        return season;
      });

      const valorSeasons = [
        {
          recordHash: 1341325320,
          objectiveHash: 1089010148
        },
        {
          recordHash: 2462707519,
          objectiveHash: 2048068317
        },
        {
          recordHash: 3666883430,
          objectiveHash: 3211089622
        },
        {
          recordHash: 2110987253,
          objectiveHash: 1898743615
        },
        {
          recordHash: 510151900,
          objectiveHash: 2011701344
        }
      ].map(season => {
        const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

        const recordScope = definitionRecord.scope || 0;
        const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

        season.resets = (recordData && recordData.objectives && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash) && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash).progress) || 0;

        return season;
      });

      return (
        <div className='view' id='legend'>
          <Button action={this.handler_print} text='Print' />
          <div ref={this.ref_page} className='page'>
            <div className='row header-note'>
              <div className='col'>{member.data.profile.profile.data.userInfo.displayName}</div>
              <div className='col'>Braytech.org</div>
              <div className='col'>{member.membershipId}</div>
            </div>
            <div className='row name'>
              <div className='displayName'>{member.data.profile.profile.data.userInfo.displayName}</div>
              <div className='groupName'>{groups.length === 1 && <div className='clan'>{groups[0].group.name}</div>}</div>
            </div>
            <div className='row basics'>
              <div className='col'>
                <div className='value'>{utils.progressionSeasonRank({ characterId: member.characterId, data: { profile: member.data.profile } }).level}</div>
                <div className='name sub'>{t('Season rank')}</div>
              </div>
              <div className='col'>
                <div className='value'>
                  {timePlayed} {timePlayed === 1 ? t('day') : t('days')}
                </div>
                <div className='name sub'>{t('Time played')}</div>
              </div>
              <div className='col'>
                <div className='value'>{member.data.profile.profileRecords.data.score.toLocaleString()}</div>
                <div className='name sub'>{t('Triumph score')}</div>
              </div>
              <div className='col'>
                <div className='value'>{utils.collectionTotal(member.data.profile).toLocaleString()}</div>
                <div className='name sub'>{t('Collection total')}</div>
              </div>
              <div className='col'>
                <div className='value'>{valorSeasons.reduce((a, v) => a + v.resets, 0)}</div>
                <div className='name sub'>{t('Valor resets')}</div>
              </div>
              <div className='col'>
                <div className='value'>{infamySeasons.reduce((a, v) => a + v.resets, 0)}</div>
                <div className='name sub'>{t('Infamy resets')}</div>
              </div>
            </div>
            <div className='row characters'>
              {[...characters, {}, {}].slice(0, 3).map((c, i) => {
                // .filter(c => c.classType !== 1)

                if (c.characterId) {
                  const classString = utils
                    .classTypeToString(c.classType)
                    .toString()
                    .toLowerCase();

                  return (
                    <div key={i} className='col'>
                      <div className={cx('class-bar', classString)}>
                        <div className='icon'>
                          <i className={`destiny-class_${classString}`} />
                        </div>
                        <div className='class'>{utils.classHashToString(c.classHash)}</div>
                        <div className='light'>{c.light}</div>
                      </div>
                      <div className='stats'>
                        {[
                          {
                            hash: 2996146975,
                            class: 'mob'
                          },
                          {
                            hash: 392767087,
                            class: 'res'
                          },
                          {
                            hash: 1943323491,
                            class: 'rec'
                          },
                          {
                            hash: 1735777505,
                            class: 'dis'
                          },
                          {
                            hash: 144602215,
                            class: 'int'
                          },
                          {
                            hash: 4244567218,
                            class: 'str'
                          }
                        ].map((stat, i) => {
                          return (
                            <div key={i} className={cx('stat', stat.class)}>
                              <div className='icon' />
                              <div className='value'>{c.stats[stat.hash]}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className='col empty'>
                      <div className='corners t' />
                      <div className='corners b' />
                    </div>
                  );
                }
              })}
            </div>
            <div className='row triumphs'>
              <div className='seals'>
                {orderBy(
                  manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode].children.presentationNodes.map((child, i) => {
                    const definitionSeal = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

                    if (definitionSeal.redacted) {
                      return null;
                    }

                    const definitionCompletionRecord = definitionSeal.completionRecordHash && manifest.DestinyRecordDefinition[definitionSeal.completionRecordHash];

                    const completionRecordData = definitionSeal && definitionSeal.completionRecordHash && definitionSeal.scope === 1 ? characterRecords[member.characterId].records[definitionSeal.completionRecordHash] : profileRecords[definitionSeal.completionRecordHash];

                    if (completionRecordData && enumerateRecordState(completionRecordData.state).rewardUnavailable && enumerateRecordState(completionRecordData.state).objectiveNotCompleted) {
                      return null;
                    }

                    const states = [];
                    definitionSeal.children.records.forEach(record => {
                      const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];
                      const recordScope = definitionRecord.scope || 0;
                      const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

                      if (recordData) {
                        states.push(recordData);
                      }
                    });

                    let nodeProgress = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
                    let nodeTotal = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;

                    // // MOMENTS OF TRIUMPH: MMXIX does not have the above ^
                    if (definitionSeal.hash === 1002334440) {
                      nodeProgress = states.filter(s => !enumerateRecordState(s.state).objectiveNotCompleted && enumerateRecordState(s.state).recordRedeemed).length;
                      nodeTotal = 23;
                    }

                    const isComplete = nodeTotal && nodeProgress === nodeTotal ? true : false;

                    const title = !definitionCompletionRecord.redacted && definitionCompletionRecord.titleInfo && definitionCompletionRecord.titleInfo.titlesByGenderHash[character.genderHash];

                    return {
                      progress: Math.floor((nodeProgress / nodeTotal) * 100),
                      title,
                      el: (
                        <div key={i} className={cx('seal', { completed: isComplete })}>
                          <ObservedImage src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.icon}`} />
                          <div className='progress'>{Math.floor((nodeProgress / nodeTotal) * 100)}</div>
                          <div className='name'>{title}</div>
                          <div className='corners t' />
                          <div className='corners b' />
                        </div>
                      )
                    };
                  }),
                  [s => s.progress, s => s.title],
                  ['desc', 'asc']
                ).map(e => e.el)}
              </div>
            </div>
            <div className='row footer-note'>
              <div className='col'>70 65 72 20 61 75 64 61 63 69 61 20 61 64 20 61 73 74 72 61</div>
              <div className='col'>
                <span className='destiny-clovis_bray_device' />
              </div>
              <div className='col'>{packageJSON.version} / 1</div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div className='view' id='legend'></div>;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Legend);
