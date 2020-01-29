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
  {
    name: 'strikes',
    modes: [
      46, // scoredNightfalls
      79 // nightmare hunts
    ]
  }
];

const medalExclusions = ['allMedalsEarned', 'medalUnknown', 'precisionKills', 'weaponKillsAbility', 'weaponKillsGrenade', 'weaponKillsMelee', 'weaponKillsSuper', 'primevalHealing', 'primevalDamage', 'primevalKills', 'motesPickedUp', 'motesLost', 'motesDeposited', 'motesDenied', 'bankOverage', 'supremacyAllyKillEnemyTagsCaptured', 'supremacyAllyTagsRecovered', 'supremacyCrestsRecovered', 'supremacyCrestsSecured', 'supremacyOwnKillEnemyTagsCaptured', 'supremacyOwnTagsRecovered'];

function formatValue(column, entry, playerCache = []) {
  if (column.extended) {
    // from the extended stats value
    return column.round ? Number.parseFloat(entry.extended.values[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.extended.values[column.key].basic[column.type].toLocaleString();
  } else if (column.async) {
    // async profile data
    const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);
    return cache && cache[column.key] ? cache[column.key] : '–';
  } else if (column.root) {
    // entry object root
    return column.round ? Number.parseFloat(entry[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry[column.key].basic[column.type].toLocaleString();
  } else {
    return column.round ? Number.parseFloat(entry.values[column.key].basic[column.type]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.values[column.key].basic[column.type].toLocaleString();
  }
}

export function EntryHeader(props) {
  const { playerCache, activityDetails, entry, team } = props;
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
    ],
    strikes: [
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
        key: 'score',
        name: manifest.DestinyHistoricalStatsDefinition['score']?.statName,
        abbr: 'S',
        type: 'value'
      }
    ]
  };

  const variety = (modes.find(m => m.modes.indexOf(activityDetails.mode) > -1)?.name && headers[modes.find(m => m.modes.indexOf(activityDetails.mode) > -1)?.name] && modes.find(m => m.modes.indexOf(activityDetails.mode) > -1)?.name) || 'default';

  if (team) {
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
    // strikes: StrikesDetail
  };

  if (!variety || !rows[variety]) return <DefaultDetail {...props} />;

  const DetailTemplate = rows[variety];

  return <DetailTemplate {...props} />;
}

export function DefaultDetail(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  if (!entry.extended?.weapons?.length && formatValue({ key: 'weaponKillsMelee', type: 'value', extended: true }, entry) === '0' && formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry) === '0' && formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry) === '0') {
    return (
      <div className='detail single'>
        <div className='group'>
          <div className='info'>{t('No stats were recorded')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='detail single'>
      <div className='group kills'>
        <ul>
          <li className='header'>
            <ul>
              <li>
                <div className='full'>{t('Weapon')}</div>
                <div className='abbr'>{t('Weapon')}</div>
              </li>
              <li>
                <div className='full'>{t('Kills')}</div>
                <div className='abbr'>K</div>
              </li>
              <li>
                <div className='full'>{t('Precision')}</div>
                <div className='abbr'>P</div>
              </li>
              <li>
                <div className='full'>{t('Accuracy')}</div>
                <div className='abbr'>A</div>
              </li>
            </ul>
          </li>
          {entry.extended?.weapons?.length
            ? entry.extended.weapons.map((weapon, w) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[weapon.referenceId];

                return (
                  <li key={w}>
                    <ul>
                      <li className='double'>
                        <ul className='list inventory-items'>
                          <li className={cx('item', 'tooltip')} data-hash={definitionItem.hash} data-uninstanced='yes'>
                            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                          </li>
                        </ul>
                        <div>{definitionItem.displayProperties.name}</div>
                      </li>
                      <li>{weapon.values?.uniqueWeaponKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{weapon.values?.uniqueWeaponPrecisionKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{(weapon.values?.uniqueWeaponKillsPrecisionKills?.basic?.value * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' || '0%'}</li>
                    </ul>
                  </li>
                );
              })
            : null}
          {entry.extended?.weapons?.length ? <li className='divider' /> : null}
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Melee kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsMelee', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Grenade kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Super kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function CrucibleDetail(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);

  return (
    <div className='detail'>
      <div className='group common'>
        <ul className='pairs'>
          <li className='header'>
            <ul>
              <li>{t('Player')}</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>{t('Glory points')}</li>
              <li className={cx({ na: !cache?.['gloryPoints'] })}>{cache?.['gloryPoints'] || '–'}</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>{t('Valor resets')}</li>
              <li className={cx({ na: !cache?.['valorResets'] })}>{cache?.['valorResets'] || '–'}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className='group kills'>
        <ul>
          <li className='header'>
            <ul>
              <li>
                <div className='full'>{t('Weapon')}</div>
                <div className='abbr'>{t('Weapon')}</div>
              </li>
              <li>
                <div className='full'>{t('Kills')}</div>
                <div className='abbr'>K</div>
              </li>
              <li>
                <div className='full'>{t('Precision')}</div>
                <div className='abbr'>P</div>
              </li>
              <li>
                <div className='full'>{t('Accuracy')}</div>
                <div className='abbr'>A</div>
              </li>
            </ul>
          </li>
          {entry.extended?.weapons?.length
            ? entry.extended.weapons.map((weapon, w) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[weapon.referenceId];

                return (
                  <li key={w}>
                    <ul>
                      <li className='double'>
                        <ul className='list inventory-items'>
                          <li className={cx('item', 'tooltip')} data-hash={definitionItem.hash} data-uninstanced='yes'>
                            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                          </li>
                        </ul>
                        <div>{definitionItem.displayProperties.name}</div>
                      </li>
                      <li>{weapon.values?.uniqueWeaponKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{weapon.values?.uniqueWeaponPrecisionKills?.basic?.value.toLocaleString() || '0'}</li>
                      <li>{(weapon.values?.uniqueWeaponKillsPrecisionKills?.basic?.value * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '%' || '0%'}</li>
                    </ul>
                  </li>
                );
              })
            : null}
          {entry.extended?.weapons?.length ? <li className='divider' /> : null}
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Melee kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsMelee', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Grenade kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li className='double'>
                <div></div>
                <div>{t('Super kills')}</div>
              </li>
              <li>{formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className='group medals'>
        <ul>
          <li className='header'>
            <ul>
              <li>{t('Medals')}</li>
            </ul>
          </li>
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
                    <li className='double'>
                      <ul className='list inventory-items'>
                        <li key={k} className='item tooltip' data-hash={key} data-type='stat'>
                          <ObservedImage className={cx('image', 'icon')} src={`${!definitionMedal.localIcon ? 'https://www.bungie.net' : ''}${icon}`} />
                        </li>
                      </ul>
                      <div>{definitionMedal.statName || t('Unknown')}</div>
                    </li>
                    <li>{count}</li>
                  </ul>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export function StrikesDetail(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId);

  return (
    <div className='detail'>
      <div className='group common'>
        <ul>
          <li>
            <ul>
              <li>{manifest.DestinyHistoricalStatsDefinition['score'].statName}</li>
              <li>{formatValue({ key: 'score', type: 'value' }, entry)}</li>
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
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li></li>
              <li>{t('Grenade kills')}</li>
              <li>{formatValue({ key: 'weaponKillsGrenade', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
          <li>
            <ul>
              <li></li>
              <li>{t('Super kills')}</li>
              <li>{formatValue({ key: 'weaponKillsSuper', type: 'value', extended: true }, entry)}</li>
              <li className='na'>–</li>
              <li className='na'>–</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
