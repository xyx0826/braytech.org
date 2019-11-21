import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';
import html2canvas from 'html2canvas';
import i18n from 'i18next';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import { enumerateRecordState } from '../../utils/destinyEnums';
import ObservedImage from '../../components/ObservedImage';
import ObservedImageBase64 from '../../components/ObservedImageBase64';
import Button from '../../components/UI/Button';
import Checkbox from '../../components/UI/Checkbox';
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

    this.state = {
      theme: {
        selected: 'bnet',
        variantIndex: 0,
        mono: {
          hue: 144,
          saturation: 0,
          luminance: 0
        }
      }
    };

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
    const viewport = this.props.viewport;
    const page = this.ref_page.current;

    console.log(page.offsetLeft)

    const modOffsetLeft = viewport.width < 1660 ? 0 : 16;
    
    html2canvas(page, {
      backgroundColor: '#ffffff',
      scale: 2,
      x: 0,
      y: 0,
      scrollX: -(page.offsetLeft + modOffsetLeft),
      scrollY: -page.offsetTop
    }).then(canvas => {
      canvas.toBlob(async blob => {
        const url = await URL.createObjectURL(blob);
        window.open(url);
      });
    });
  };

  themes = {
    bnet: {
      name: 'Bungie.net',
      description: i18n.t('In the modern though timeless style of Bungie.net itself'),
      background: {
        src: '/static/images/extracts/flair/010A_0623_00.png'
      },
      variants: [
        {
          name: i18n.t('Destiny 2'),
          dyes: [
            {
              channel: '--background-primary-1',
              value: 'hsla(216, 29%, 9%, 1)'
            },
            {
              channel: '--triumph-seal-1',
              value: '#7b3274'
            },
            {
              channel: '--triumph-seal-2',
              value: '#63215d'
            },
            {
              channel: '--class-titan-1',
              value: '#912b21'
            },
            {
              channel: '--class-hunter-1',
              value: '#3b636d'
            },
            {
              channel: '--class-warlock-1',
              value: '#a67d1c'
            }
          ]
        },
        {
          name: i18n.t('Destiny 1'),
          dyes: [
            {
              channel: '--background-primary-1',
              value: 'hsla(216, 29%, 9%, 1)'
            },
            {
              channel: '--triumph-seal-1',
              value: '#9d7207'
            },
            {
              channel: '--triumph-seal-2',
              value: '#cd9609'
            }
          ]
        }
      ]
    },
    mono: {
      name: i18n.t('Monotone'),
      description: i18n.t('A single colour - or none - at various saturations and luminances'),
      variants: [
        {
          dyes: [
            {
              channel: '--background-primary-1',
              value: {
                hue: 0,
                saturation: 38,
                luminance: 12,
                alpha: 1
              }
            },
            {
              channel: '--text-primary-100',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 50,
                alpha: 1
              }
            },
            {
              channel: '--text-primary-80',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 40,
                alpha: 0.8
              }
            },
            {
              channel: '--text-primary-60',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 30,
                alpha: 0.6
              }
            },
            {
              channel: '--text-primary-40',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 30,
                alpha: 0.4
              }
            },
            {
              channel: '--text-primary-10',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 20,
                alpha: 0.1
              }
            },
            {
              channel: '--text-primary-5',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 50,
                alpha: 0.05
              }
            },
            {
              channel: '--triumph-seal-1',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 38,
                alpha: 0.4
              }
            },
            {
              channel: '--triumph-seal-2',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 38,
                alpha: 0.2
              }
            },
            {
              channel: '--class-titan-1',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 22,
                alpha: 0.6
              }
            },
            {
              channel: '--class-hunter-1',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 22,
                alpha: 0.6
              }
            },
            {
              channel: '--class-warlock-1',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 22,
                alpha: 0.6
              }
            },
            {
              channel: '--text-margins',
              value: {
                hue: 0,
                saturation: 62,
                luminance: 30,
                alpha: 0.4
              }
            }
          ]
        }
      ]
    }
  }

  handler_setTheme = key => e => {
    this.setState(p => ({
      ...p,
      theme: {
        ...p.theme,
        selected: key,
        variantIndex: 0
      }
    }));
  }

  handler_setVariant = key => e => {
    this.setState(p => ({
      ...p,
      theme: {
        ...p.theme,
        variantIndex: parseInt(key, 10)
      }
    }));
  }

  handler_setMonoHue = e => {
    const hue = parseInt(e.target.value, 10);

    this.setState(p => ({
      theme: {
        selected: 'mono',
        variantIndex: 0,
        mono: {
          hue,
          saturation: p.theme.mono.saturation,
          luminance: p.theme.mono.luminance
        }
      }
    }));
  }

  handler_setMonoSaturation = e => {
    const saturation = parseInt(e.target.value, 10);

    this.setState(p => ({
      theme: {
        selected: 'mono',
        variantIndex: 0,
        mono: {
          hue: p.theme.mono.hue,
          saturation,
          luminance: p.theme.mono.luminance
        }
      }
    }));
  }

  handler_setMonoLuminance = e => {
    const luminance = parseInt(e.target.value, 10);

    this.setState(p => ({
      theme: {
        selected: 'mono',
        variantIndex: 0,
        mono: {
          hue: p.theme.mono.hue,
          saturation: p.theme.mono.saturation,
          luminance
        }
      }
    }));
  }

  render() {
    const { t, member } = this.props;

    if (member && member.data) {
      const characters = member.data.profile.characters.data;
      const character = characters.find(c => c.characterId === member.characterId);
      const profileRecords = member.data.profile.profileRecords.data.records;
      const characterRecords = member.data.profile.characterRecords.data;
      const groups = member.data.groups.results;
      const characterEquipment = member.data.profile.characterEquipment.data;

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

      const theme = this.themes[this.state.theme.selected];
      const dyes = theme.variants[this.state.theme.variantIndex].dyes.reduce((a, v) => {
        if (this.state.theme.selected === 'mono') {
          let saturation = this.state.theme.mono.saturation;
          let luminance = this.state.theme.mono.luminance;

          if (saturation < 0) {
            saturation = Math.max(saturation + v.value.saturation, 0);
          } else {
            saturation = Math.min(saturation + v.value.saturation, 100);
          }

          if (luminance < 0) {
            luminance = Math.max(luminance + v.value.luminance, 0);
          } else {
            luminance = Math.min(luminance + v.value.luminance, 100);
          }

          if (v.channel !== '--background-primary-1' && saturation === 0) {
            luminance = Math.min(luminance + 36, 100);
          }

          a[v.channel] = `hsla(${[this.state.theme.mono.hue, saturation, luminance, v.value.alpha].map((p, i) => i > 0 && i < 3 ? `${p}%` : p)})`;
        } else {
          a[v.channel] = v.value;
        }

        return a;
      }, {});

      return (
        <div className='view' id='legend'>
          <div className='config'>
            <div className='page-header'>
              <div className='name'>{t('Legend')}</div>
            </div>
            <div className='options'>
              <div className='row'>
                <div className='col'>
                  <div className='module-header'>
                    <div>{t('Theme')}</div>
                  </div>
                  <ul className='list settings'>
                {Object.keys(this.themes).map(key => (
                  <li key={key} onClick={this.handler_setTheme(key)}>
                    <Checkbox linked checked={this.state.theme.selected === key} text={this.themes[key].name} />
                    <div className='info'>
                      <p>{this.themes[key].description}</p>
                    </div>
                  </li>
                ))}
              </ul>
                </div>
                <div className='col'>
                  <div className='module-header'>
                    <div>{t('Variant')}</div>
                  </div>
                  <ul className='list settings'>
                {theme.variants.map((v, i) => {
                  if (this.state.theme.selected === 'mono') {
                    return (
                      <React.Fragment key={i}>
                        <li>
                          <input key='rangeHue' type='range' min='0' max='359' step='1' value={this.state.theme.mono.hue} onChange={this.handler_setMonoHue} />
                          <div className='info'>
                            <p>{t('Adjust the hue')}</p>
                          </div>
                        </li>
                        <li>
                          <input key='rangeSat' type='range' min='-100' max='100' step='1' value={this.state.theme.mono.saturation} onChange={this.handler_setMonoSaturation} />
                          <div className='info'>
                            <p>{t('Adjust the saturation')}</p>
                          </div>
                        </li>
                        <li>
                          <input key='rangeLum' type='range' min='-10' max='30' step='1' value={this.state.theme.mono.luminance} onChange={this.handler_setMonoLuminance} />
                          <div className='info'>
                            <p>{t('Adjust the luminance')}</p>
                          </div>
                        </li>
                      </React.Fragment>
                    )
                  }
                  else {
                    return (
                      <li key={i} onClick={this.handler_setVariant(i)}>
                        <Checkbox linked checked={this.state.theme.variantIndex === i} text={v.name} />
                      </li>
                    )
                  }
                })}
              </ul>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <Button action={this.handler_print} text={t('Export to .PNG')} />
                </div>
              </div>
            </div>
          </div>
          <div ref={this.ref_page} className={cx('page', this.state.theme.selected)} style={dyes}>
            {theme.background ? (
              <div className='background'>
                <ObservedImage src={theme.background.src} />
              </div>
            ) : null}
            <div className='grid'>
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
                <div className='line' />
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
                <div className='line' />
              </div>
              <div className='row characters'>
                {[...characters, {}, {}].slice(0, 3).map((c, i) => {
                  // .filter(c => c.classType !== 1)

                  const subClassInfo = c.characterId && utils.getSubclassPathInfo(member.data.profile, c.characterId);

                  const equipment = (c.characterId && characterEquipment[c.characterId].items.map(item => {
                    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
                    
                    if (definitionItem) {
                      return {
                        ...item,
                        displayProperties: definitionItem.displayProperties,
                        inventory: definitionItem.inventory
                      }
                    } else {
                      return false
                    }
                  })) || [];

                  const loadout = (c.characterId && [
                    equipment.find(item => item.inventory.bucketTypeHash === 1498876634),
                    equipment.find(item => item.inventory.bucketTypeHash === 2465295065),
                    equipment.find(item => item.inventory.bucketTypeHash === 953998645),
                    ...[
                      equipment.find(item => item.inventory.bucketTypeHash === 3448274439),
                      equipment.find(item => item.inventory.bucketTypeHash === 3551918588),
                      equipment.find(item => item.inventory.bucketTypeHash === 14239492),
                      equipment.find(item => item.inventory.bucketTypeHash === 20886954)
                    ].filter(i => i.inventory.tierType === 6)
                  ]) || [];

                  console.log(loadout)

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
                        <div className='padder'>
                          <div className='stats'>
                            {[
                              {
                                hash: 2996146975,
                                icon: 'destiny-mobility'
                              },
                              {
                                hash: 392767087,
                                icon: 'destiny-resilience'
                              },
                              {
                                hash: 1943323491,
                                icon: 'destiny-recovery'
                              },
                              {
                                hash: 1735777505,
                                icon: 'destiny-discipline'
                              },
                              {
                                hash: 144602215,
                                icon: 'destiny-intellect'
                              },
                              {
                                hash: 4244567218,
                                icon: 'destiny-strength'
                              }
                            ].map((stat, i) => {
                              return (
                                <div key={i} className='stat'>
                                  <div className={stat.icon} />
                                  <div className='value'>{Math.floor((c.stats[stat.hash] || 0) / 10)}</div>
                                </div>
                              );
                            })}
                          </div>
                          <div key={i} className='super'>
                            <div className={cx('icon', `sbp_${subClassInfo && subClassInfo.super.hash}`)}>{subClassInfo && subClassInfo.super.icon}</div>
                            <div className='text'>
                              <div className='name'>{subClassInfo && subClassInfo.super.name}</div>
                              <div className='description'>{subClassInfo && subClassInfo.super.description}</div>
                            </div>
                          </div>
                          <div className='loadout'>
                            <ul>
                              {[...loadout, {}].slice(0, 4).map((item, i) => {
                                if (item.itemHash) {
                                  return (
                                    <li key={i}>
                                      <div className='icon'>
                                        <ObservedImageBase64 noConstraints src={`https://www.bungie.net${item.displayProperties.icon}`} />
                                      </div>
                                      <div className='text'>
                                        <div className='name'>{item.displayProperties.name}</div>
                                        <div className='description'>{item.displayProperties.description}</div>
                                      </div>
                                    </li>
                                  )
                                } else {
                                  return (
                                    <li key={i} className='empty'>
                                      <div className='icon'>
                                        <div className='corners t' />
                                        <div className='corners b' />
                                      </div>
                                      <div className='text'>
                                        <div className='name' />
                                        <div className='description' />
                                      </div>
                                    </li>
                                  );
                                }
                              })}
                            </ul>
                          </div>
                          <div className='corners b' />
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

                      let nodeProgress = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives.length && profileRecords[definitionSeal.completionRecordHash].objectives[0].progress;
                      let nodeTotal = profileRecords[definitionSeal.completionRecordHash] && profileRecords[definitionSeal.completionRecordHash].objectives.length && profileRecords[definitionSeal.completionRecordHash].objectives[0].completionValue;

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
                            <div className={cx('icon', `destiny-seal-${definitionSeal.hash}`)} />
                            <div className='progress'>{Math.floor((nodeProgress / nodeTotal) * 100)}</div>
                            <div className='name'>{title}</div>
                            <div className='corners t' />
                            <div className='corners b' />
                          </div>
                        )
                      };
                    }).filter(s => s),
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
                <div className='col'>{packageJSON.version} / 1 / {new Date().toISOString()}</div>
              </div>
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
    member: state.member,
    viewport: state.viewport
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Legend);
