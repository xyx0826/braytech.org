import React from 'react';
import i18n from 'i18next';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

const Default = props => {
  const { itemHash, itemInstanceId, itemComponents, quantity } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // flair string
  const flair = definitionItem.displaySource && definitionItem.displaySource !== '' && definitionItem.displaySource;

  const objectives = [];
  const rewards = [];

  const expirationDate = itemComponents && itemComponents.item && itemComponents.item.expirationDate;
  const timestamp = expirationDate && new Date().getTime();
  const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

  // item objectives
  definitionItem.objectives &&
    definitionItem.objectives.objectiveHashes.forEach(hash => {
      const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

      const instanceProgressObjective = itemComponents?.objectives?.length && itemComponents.objectives.find(o => o.objectiveHash === hash);

      let playerProgress = {
        complete: false,
        progress: 0,
        objectiveHash: definitionObjective.hash
      };

      playerProgress = { ...playerProgress, ...instanceProgressObjective };

      objectives.push(<ProgressBar key={definitionObjective.hash} objectiveHash={definitionObjective.hash} {...playerProgress} />);
    });

  // potential rewards
  definitionItem.value &&
    definitionItem.value.itemValue.forEach(value => {
      if (value.itemHash !== 0) {
        const definitionReward = manifest.DestinyInventoryItemDefinition[value.itemHash];

        rewards.push(
          <li key={value.itemHash}>
            <div className='icon'>{definitionReward.displayProperties.icon && <ObservedImage className='image' src={`https://www.bungie.net${definitionReward.displayProperties.icon}`} />}</div>
            <div className='text'>
              {definitionReward.displayProperties.name}
              {value.quantity > 1 ? <> +{value.quantity}</> : null}
            </div>
          </li>
        );
      }
    });

  return (
    <>
      {flair ? (
        <div className='flair'>
          <p>{flair}</p>
        </div>
      ) : null}
      {flair && description && <div className='line' />}
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {objectives.length ? <div className='objectives'>{objectives}</div> : null}
      {rewards.length ? (
        <div className='rewards'>
          <div>{i18n.t('Rewards')}</div>
          <ul>{rewards}</ul>
        </div>
      ) : null}
      {itemComponents?.objectives?.length && itemComponents.objectives.filter(o => !o.complete).length > 0 && expirationDate ? (
        <div className='expiry'>
          {timestampExpiry > timestamp ? (
            <>
              {i18n.t('Expires')} <Moment fromNow>{expirationDate}</Moment>.
            </>
          ) : (
            <>{i18n.t('Expired')}.</>
          )}
        </div>
      ) : null}
      {quantity && definitionItem.inventory && definitionItem.inventory.maxStackSize > 1 && quantity === definitionItem.inventory.maxStackSize ? (
        <div className='quantity'>
          {i18n.t('Quantity')}: <span>{quantity}</span> <span className='max'>({i18n.t('max')})</span>
        </div>
      ) : null}
    </>
  );
};

export default Default;
