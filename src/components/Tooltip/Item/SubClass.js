import React from 'react';
import i18n from 'i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { damageTypeToString, getSubclassPathInfo } from '../../../utils/destinyUtils';
import { getSocketsWithStyle, getModdedStatValue, getSumOfArmorStats } from '../../../utils/destinyItems/utils';
import { statsMs } from '../../../utils/destinyItems/stats';
import ObservedImage from '../../ObservedImage';

const Subclass = props => {
  const { itemHash, itemInstanceId, itemComponents, primaryStat, stats, sockets, masterworkInfo } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const subClassInfo = getSubclassPathInfo(itemComponents, { itemHash, itemInstanceId });

  console.log(subClassInfo);

  // description as flair string
  const flair = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  return (
    <>
      {subClassInfo ? (
        <div className='super'>
          <div className='path'>
            <div className='line' />
            <div className='text'>{subClassInfo.name}</div>
            <div className='line' />
          </div>
          <div className='ability'>
            <div className='text'>
              <div className='name'>{subClassInfo.super.name}</div>
              <div className='description'>
                <p>{subClassInfo.super.description}</p>
              </div>
            </div>
            <div className='icon'>{subClassInfo.super.icon}</div>
          </div>
        </div>
      ) : null}
      <div className='line' />
      <div className='flair'>
        <p>{flair}</p>
      </div>
    </>
  );
};

export default Subclass;
