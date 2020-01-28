import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

const modes = [
  {
    name: 'crucible',
    modes: [69, 70, 71, 72, 74, 73, 81, 50, 43, 44, 48, 60, 65, 59, 31, 37, 38, 37]
  },
  {
    name: 'gambit',
    modes: [63, 75]
  },
  {
    name: 'scoredNightfalls',
    modes: [46]
  }
];

const medalExclusions = ['medalUnknown', 'precisionKills', 'weaponKillsAbility', 'weaponKillsGrenade', 'weaponKillsMelee', 'weaponKillsSuper', 'primevalHealing', 'primevalDamage', 'primevalKills', 'motesPickedUp', 'motesLost', 'motesDeposited', 'motesDenied', 'bankOverage', 'supremacyAllyKillEnemyTagsCaptured', 'supremacyAllyTagsRecovered', 'supremacyCrestsRecovered', 'supremacyCrestsSecured', 'supremacyOwnKillEnemyTagsCaptured', 'supremacyOwnTagsRecovered'];

function RowCrucible(props) {
  const { t, i18n } = useTranslation();
console.log(props)
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
  ]

  return (
    null
  );
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
  }

  const variety = modes.find(m => m.modes.indexOf(activityDetails.mode) > -1)?.name;

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
      <div key={i} className={cx('stat', { hideInline: column.hideInline, extended: column.extended }, column.key)}>
        {column.expanded ? <div className='name'>{column.name}</div> : null}
        <div className='value'>{formatValue(column, entry, playerCache)}</div>
      </div>
    ));
  }
}

export function EntryRow(props) {
  const mode = props.activityDetails.mode;

  return <CrucibleRow {...props} />
}

export function CrucibleRow(props) {
  const { playerCache, activityDetails, entry } = props;
  const { t, i18n } = useTranslation();

  const cache = playerCache.find(p => p.membershipId === entry.player.destinyUserInfo.membershipId)

  return (
    <div className='expanded'>
      <div className='group'>
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
    </div>
  )
}