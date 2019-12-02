import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import * as utils from '../../../../utils/destinyUtils';
import ObservedImage from '../../../../components/ObservedImage';
import Items from '../../../../components/Items';

import './styles.css';

class CharacterEquipment extends React.Component {
  render() {
    const { t, member } = this.props;
    const character = member.data.profile.characters.data.find(c => c.characterId === member.characterId);
    const characterEquipment = member.data.profile.characterEquipment.data;

    const subClassInfo = utils.getSubclassPathInfo(member.data.profile, member.characterId);

    const equipment =
      characterEquipment[member.characterId].items.map(item => {
        const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

        if (definitionItem) {
          return {
            ...item,
            displayProperties: definitionItem.displayProperties,
            inventory: definitionItem.inventory
          };
        } else {
          return false;
        }
      }) || [];

    // console.log(equipment);

    const weapons = [
      equipment.find(item => item.inventory.bucketTypeHash === 1498876634),
      equipment.find(item => item.inventory.bucketTypeHash === 2465295065),
      equipment.find(item => item.inventory.bucketTypeHash === 953998645)
    ];
    
    const armor = [      
      equipment.find(item => item.inventory.bucketTypeHash === 3448274439),
      equipment.find(item => item.inventory.bucketTypeHash === 3551918588),
      equipment.find(item => item.inventory.bucketTypeHash === 14239492),
      equipment.find(item => item.inventory.bucketTypeHash === 20886954),
      equipment.find(item => item.inventory.bucketTypeHash === 1585787867)
    ];

    return (
      <div className='character-equipment'>
        <div className='module-header'>
          <div className='sub-name'>{t('Character equipment')}</div>
        </div>
        <div className='super'>
          <div className={cx('icon', `sbp_${subClassInfo && subClassInfo.super.hash}`)}>{subClassInfo && subClassInfo.super.icon}</div>
          <div className='text'>{subClassInfo && subClassInfo.super.name}</div>
        </div>
        <h4>{t('Stats')}</h4>
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
                <div className='value'>{character.stats[stat.hash] || 0}</div>
              </div>
            );
          })}
        </div>
        <h4>{manifest.DestinyPresentationNodeDefinition[1528930164].displayProperties.name}</h4>
        <ul className='list inventory-items'>
          <Items items={weapons} />
        </ul>
        <h4>{manifest.DestinyPresentationNodeDefinition[1605042242].displayProperties.name}</h4>
        <ul className='list inventory-items'>
          <Items items={armor} />
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(connect(mapStateToProps), withTranslation())(CharacterEquipment);
