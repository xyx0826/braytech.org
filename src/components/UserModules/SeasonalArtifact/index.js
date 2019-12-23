import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { seasonalMods } from '../../../utils/destinyEnums';
import Items from '../../Items';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

class SeasonalArtifact extends React.Component {
  render() {
    const { t, member } = this.props;
    const profileProgression = member.data.profile.profileProgression.data;
    const characterEquipment = member.data.profile.characterEquipment.data[member.characterId].items;
    const characterProgressions = member.data.profile.characterProgressions.data[member.characterId];

    const equippedArtifact = characterEquipment.find(i => i.bucketHash === 1506418338) || false;

    if (!equippedArtifact) {
      return (
        <div className='head'>
          <div className='sub-header'>
            <div>{t('Seasonal progression')}</div>
          </div>
          <div className='info'>
            <p>{t("This profile hasn't received an artifact yet.")}</p>
          </div>
        </div>
      );
    }

    const profileArtifact = profileProgression.seasonalArtifact;
    const characterArtifact = characterProgressions.seasonalArtifact;

    const definitionArtifact = profileArtifact.artifactHash && manifest.DestinyArtifactDefinition[profileArtifact.artifactHash];
    // const definitionVendor = profileArtifact.artifactHash && manifest.DestinyVendorDefinition[profileArtifact.artifactHash];  

    // let string = ''
    //     definitionArtifact.tiers.forEach(tier => {
    //       tier.items.forEach(item => {
    //         const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash]
    // string = string + `
    // // ${definitionItem.displayProperties.name}
    // ${item.itemHash}: {
    //   hash: ${item.itemHash},
    //   active: '/static/images/extracts/ui/artifact/3360014173/0000000.png',
    //   inactive: '/static/images/extracts/ui/artifact/3360014173/0000000.png'
    // },`
    //       })
    //     })
    //     console.log(string)

    // console.log(characterArtifact)

    if (!definitionArtifact) {
      return (
        <div className='seasonal-artifact'>
          <div className='head'>
            <div className='sub-header'>
              <div>{t('Seasonal progression')}</div>
            </div>
            <div className='artifact'>
              
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='seasonal-artifact'>
        <div className='head'>
          <div className='sub-header'>
            <div>{t('Seasonal progression')}</div>
          </div>
          <div className='artifact'>
            <ul className='list inventory-items'>
              <Items items={[equippedArtifact]} />
            </ul>
            <div className='text'>
              <div className='name'>{definitionArtifact.displayProperties.name}</div>
              <div className='type'>{t('Seasonal Artifact')}</div>
            </div>
            <div className='description'>
              <p>{definitionArtifact.displayProperties.description}</p>
            </div>
          </div>
        </div>
        <div className='grid'>
          <div className='mods'>
            <h4>{t('Mods')}</h4>
            <div className='tiers'>
              {definitionArtifact.tiers.map((tier, t) => {
                const tierUnlocksUsed = characterArtifact.tiers[t]?.items.filter(i => i.isActive).length || 0;

                return (
                  <div
                    key={t}
                    className={cx('tier', {
                      available: characterArtifact.pointsUsed >= tier.minimumUnlockPointsUsedRequirement,
                      last: (t < 4 && characterArtifact.pointsUsed < definitionArtifact.tiers[t + 1]?.minimumUnlockPointsUsedRequirement && tierUnlocksUsed > 0) || t === 4
                    })}
                  >
                    <ul className='list inventory-items'>
                      {(characterArtifact.tiers[t]?.items || tier.items).map((item, i) => {
                        const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

                        const image = seasonalMods[equippedArtifact.itemHash] && seasonalMods[equippedArtifact.itemHash][item.itemHash] ? (!item.isActive ? seasonalMods[equippedArtifact.itemHash][item.itemHash].inactive : seasonalMods[equippedArtifact.itemHash][item.itemHash].active) : definitionItem && `https://www.bungie.net${definitionItem.displayProperties.icon}`;

                        const energyCost = definitionItem && definitionItem.plug && definitionItem.plug.energyCost ? definitionItem.plug.energyCost.energyCost : 0;

                        return (
                          <li
                            key={i}
                            className={cx({
                              tooltip: true,
                              linked: true,
                              'no-border': true,
                              unavailable: !item.isActive
                            })}
                            data-hash={item.itemHash}
                            data-instanceid={item.itemInstanceId}
                            data-state={item.state}
                            // data-vendorhash={item.vendorHash}
                            // data-vendorindex={item.vendorItemIndex}
                            // data-vendorstatus={item.saleStatus}
                            data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                          >
                            <div className='icon'>
                              {!item.isActive ? <ObservedImage className='image background' src='/static/images/extracts/ui/artifact/01A3_12DB_00.png' /> : null}
                              <ObservedImage src={image} />
                              <div className='cost'>{energyCost}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='progression'>
            <h4>{t('Progression')}</h4>
            <p>
              <em>{t('Earning XP grants Power bonuses and unlocks powerful mods that can be slotted into weapons and armor.')}</em>
            </p>
            <div className='integers'>
              <div>
                <div className='name'>{t('Artifact unlocks')}</div>
                <div className='value'>
                  {profileArtifact.pointProgression?.level ? (
                    <>
                      {profileArtifact.pointProgression.level} / {profileArtifact.pointProgression.levelCap}
                    </>
                  ) : (
                    <>—</>
                  )}
                </div>
              </div>
              <div>
                <div className='name'>{t('Power bonus')}</div>
                {profileArtifact.powerBonus > 0 ? <div className='value power'>+{profileArtifact.powerBonus}</div> : <div className='value'>—</div>}
              </div>
            </div>
            <p>{t('Next power bonus')}</p>
            <ProgressBar {...profileArtifact.powerBonusProgression} hideCheck />
            {profileArtifact.pointProgression?.level < profileArtifact.pointProgression?.levelCap ? (
              <>
                <p>{t('Next artifact unlock')}</p>
                <ProgressBar {...profileArtifact.pointProgression} hideCheck />
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(SeasonalArtifact);
