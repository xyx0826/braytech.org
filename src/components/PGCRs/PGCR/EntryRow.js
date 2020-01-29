import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

const modes = [
  {
    name: 'crucible',
    modes: [69, 70, 71, 72, 74, 73, 81, 50, 43, 44, 48, 60, 65, 59, 31, 37, 38, 37, 25, 51, 52, 53, 54, 55, 56, 57]
  },
  // {
  //   name: 'gambit',
  //   modes: [63, 75]
  // },
  // {
  //   name: 'scoredNightfalls',
  //   modes: [46]
  // }
];

const medalExclusions = ['allMedalsEarned', 'medalUnknown', 'precisionKills', 'weaponKillsAbility', 'weaponKillsGrenade', 'weaponKillsMelee', 'weaponKillsSuper', 'primevalHealing', 'primevalDamage', 'primevalKills', 'motesPickedUp', 'motesLost', 'motesDeposited', 'motesDenied', 'bankOverage', 'supremacyAllyKillEnemyTagsCaptured', 'supremacyAllyTagsRecovered', 'supremacyCrestsRecovered', 'supremacyCrestsSecured', 'supremacyOwnKillEnemyTagsCaptured', 'supremacyOwnTagsRecovered'];

function RowCrucible(props) {
  const { t, i18n } = useTranslation();
  console.log(props);
  const header = [
    {
      key: 'opponentsDefeated',
      name: t('Kills + assists'),
      abbr: 'KA',
      type: 'value'
    },
    {
      key: 'kills',
      name: t('Kills'),
      abbr: 'K',
      type: 'value'
    },
    {
      key: 'deaths',
      name: t('Deaths'),
      abbr: 'D',
      type: 'value'
    },
    {
      key: 'killsDeathsRatio',
      name: t('K/D'),
      abbr: 'KD',
      type: 'value',
      round: true
    },
    {
      key: 'gloryPoints',
      name: t('Glory points'),
      abbr: 'G',
      type: 'value',
      async: true,
      hideInline: true
    }
  ];

  const expanded = [
    {
      key: 'common',
      name: t('Common'),
      fields: [
        {
          key: 'gloryPoints',
          name: t('Glory points'),
          type: 'value',
          async: true
        },
        {
          key: 'valorResets',
          name: t('Valor resets'),
          type: 'value',
          async: true
        },
        {
          key: 'weapons',
          name: t('Weapons used')
        }
      ]
    },
    {
      name: t('Basic'),
      key: 'basic',
      fields: [
        {
          key: 'kills',
          name: t('Kills'),
          type: 'value'
        },
        {
          key: 'assists',
          name: t('Assists'),
          type: 'value'
        },
        {
          key: 'deaths',
          name: t('Deaths'),
          abbr: 'D',
          type: 'value'
        },
        {
          key: 'killsDeathsRatio',
          name: t('K/D'),
          type: 'value',
          round: true
        },
        {
          key: 'allMedalsEarned',
          name: t('Medals earned'),
          type: 'value',
          extended: true
        }
      ]
    },
    {
      key: 'extra',
      name: t('Extra'),
      fields: [
        {
          key: 'precisionKills',
          name: t('Precision kills'),
          type: 'value',
          extended: true
        },
        {
          key: 'weaponKillsSuper',
          name: t('Super kills'),
          type: 'value',
          extended: true
        },
        {
          key: 'weaponKillsGrenade',
          name: t('Grenade kills'),
          type: 'value',
          extended: true
        },
        {
          key: 'weaponKillsMelee',
          name: t('Melee kills'),
          type: 'value',
          extended: true
        },
        {
          key: 'weaponKillsAbility',
          name: t('Ability kills'),
          type: 'value',
          extended: true
        }
      ]
    },
    {
      key: 'medals',
      name: t('Medals'),
      fields: [
        {
          key: 'medals'
        }
      ]
    }
  ];

  return null;
}

function formatValue(column, entry, playerCache = []) {
  let value;

  if (column.extended) {
    value = column.round ? Number.parseFloat(entry.extended.values[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.extended.values[column.key].basic[column.type];
  } else if (column.async) {
    const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);
    value = cache && cache[column.key] ? cache[column.key] : '–';
  } else if (column.root) {
    value = column.round ? Number.parseFloat(entry[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry[column.key].basic[column.type];
  } else {
    value = column.round ? Number.parseFloat(entry.values[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.values[column.key].basic[column.type];
  }

  return value;
}

export function EntryHeader(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const headers = {
    default: [
      {
        key: 'opponentsDefeated',
        name: t('Kills + assists'),
        abbr: 'KA',
        type: 'value'
      },
      {
        key: 'kills',
        name: t('Kills'),
        abbr: 'K',
        type: 'value'
      },
      {
        key: 'deaths',
        name: t('Deaths'),
        abbr: 'D',
        type: 'value'
      },
      {
        key: 'killsDeathsRatio',
        name: t('K/D'),
        abbr: 'KD',
        type: 'value',
        round: true
      }
    ],
    crucible: [
      {
        key: 'opponentsDefeated',
        name: t('Kills + assists'),
        abbr: 'KA',
        type: 'value'
      },
      {
        key: 'kills',
        name: t('Kills'),
        abbr: 'K',
        type: 'value'
      },
      {
        key: 'deaths',
        name: t('Deaths'),
        abbr: 'D',
        type: 'value'
      },
      {
        key: 'killsDeathsRatio',
        name: t('K/D'),
        abbr: 'KD',
        type: 'value',
        round: true
      },
      {
        key: 'gloryPoints',
        name: t('Glory points'),
        abbr: 'G',
        type: 'value',
        async: true,
        hideInline: true
      }
    ]
  };

  const variety = modes.find(m => m.modes.indexOf(activityDetails.mode) > -1)?.name || 'default';

  if (!variety || !headers[variety]) return null;

  if (props.team) {
    return headers[variety].map((column, i) => (
      <div key={i} className={cx(column.key, { hideInline: column.hideInline })}>
        <div className='full'>{column.name}</div>
        <div className='abbr'>{column.abbr}</div>
      </div>
    ));
  } else {
    return headers[variety].map((column, i) => (
      <div key={i} className={cx(column.key, { hideInline: column.hideInline, extended: column.extended })}>
        {column.expanded ? <div className='name'>{column.name}</div> : null}
        <div className='value'>{formatValue(column, entry, playerCache)}</div>
      </div>
    ));
  }
}

export function EntryDetail(props) {
  const mode = props.activityDetails.mode;

  const variety = modes.find(m => m.modes.indexOf(mode) > -1)?.name;

  const rows = {
    crucible: CrucibleDetail
  }

  if (!variety || !rows[variety]) return <DefaultDetail {...props} />;

  const DetailTemplate = rows[variety];

  return <DetailTemplate {...props} />;
}

export function DefaultDetail(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);

  return (
    <>
      <div className='group common'>
        <ul>
          <li>
            <ul>
              <li></li>
              <li></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className='group kills'>
        <ul>
          {entry.extended?.weapons?.length
            ? entry.extended.weapons.map((weapon, w) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[weapon.referenceId];

                return (
                  <li key={w}>
                    <ul>
                      <li>
                        <ul className='list inventory-items'>
                          <li className={cx('item', 'tooltip')} data-hash={definitionItem.hash} data-uninstanced='yes'>
                            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                          </li>
                        </ul>
                      </li>
                      <li>{definitionItem.displayProperties.name}</li>
                      <li>{weapon.values?.uniqueWeaponKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{weapon.values?.uniqueWeaponPrecisionKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{(weapon.values?.uniqueWeaponKillsPrecisionKills?.basic?.value * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' || '0%'}</li>
                    </ul>
                  </li>
                );
              })
            : null}
          <li>
            <ul>
              <li></li>
              <li>{t('Melee kills')}</li>
              <li>{formatValue({ key: 'weaponKillsMelee', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li></li>
              <li>{t('Grenade kills')}</li>
              <li>{formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>??</li>
              <li>{t('Super kills')}</li>
              <li>{formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}

export function CrucibleDetail(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);

  return (
    <>
      <div className='group common'>
        <ul>
          <li>
            <ul>
              <li>{t('Glory points')}</li>
              <li>{cache?.['gloryPoints'] || '–'}</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>{t('Valor resets')}</li>
              <li>{cache?.['valorResets'] || '–'}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className='group kills'>
        <ul>
          {entry.extended?.weapons?.length
            ? entry.extended.weapons.map((weapon, w) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[weapon.referenceId];

                return (
                  <li key={w}>
                    <ul>
                      <li>
                        <ul className='list inventory-items'>
                          <li className={cx('item', 'tooltip')} data-hash={definitionItem.hash} data-uninstanced='yes'>
                            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                          </li>
                        </ul>
                      </li>
                      <li>{definitionItem.displayProperties.name}</li>
                      <li>{weapon.values?.uniqueWeaponKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{weapon.values?.uniqueWeaponPrecisionKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{(weapon.values?.uniqueWeaponKillsPrecisionKills?.basic?.value * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' || '0%'}</li>
                    </ul>
                  </li>
                );
              })
            : null}
          <li>
            <ul>
              <li></li>
              <li>{t('Melee kills')}</li>
              <li>{formatValue({ key: 'weaponKillsMelee', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li></li>
              <li>{t('Grenade kills')}</li>
              <li>{formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>??</li>
              <li>{t('Super kills')}</li>
              <li>{formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry)}</li>
              <li>–</li>
              <li>–</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className='group medals'>
        <ul>
          {Object.keys(entry.extended.values)
            .filter(key => !medalExclusions.includes(key))
            .sort((a, b) => (entry.extended.values[b].basic?.value || 0) - (entry.extended.values[a].basic?.value || 0))
            .map((key, k) => {
              const medal = entry.extended.values[key];
              const definitionMedal = manifest.DestinyHistoricalStatsDefinition[key];

              const count = medal.basic?.value || '0';
              const icon = definitionMedal && definitionMedal.iconImage && definitionMedal.iconImage !== '' ? definitionMedal.iconImage : manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage;

              return (
                <li key={k}>
                  <ul>
                    <li>
                      <ul className='list inventory-items'>
                        <li key={k} className='item tooltip' data-hash={key} data-type='stat'>
                          <ObservedImage className={cx('image', 'icon')} src={`${!definitionMedal.localIcon ? 'https://www.bungie.net' : ''}${icon}`} />
                        </li>
                      </ul>
                    </li>
                    <li>{definitionMedal.statName || t('Unknown')}</li>
                    <li>{count}</li>
                  </ul>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
