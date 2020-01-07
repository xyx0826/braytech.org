import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';

import manifest from '../../../utils/manifest';

import './styles.css';

const nightmareHunts = [
  {
    storyHash: 1060539534, // Despair
    activities: [2450170730, 2450170731, 2450170732, 2450170733]
  },
  {
    storyHash: 2279262916, // Rage
    activities: [4098556690, 4098556691, 4098556692, 4098556693]
  },
  {
    storyHash: 2508299477, // Servitude
    activities: [1188363426, 1188363427, 1188363428, 1188363429]
  },
  {
    storyHash: 2622431190, // Fear
    activities: [1342492674, 1342492675, 1342492676, 1342492677]
  },
  {
    storyHash: 2918838311, // Anguish
    activities: [571058904, 571058905, 571058910, 571058911]
  },
  {
    storyHash: 3459379696, // Isolation
    activities: [3205253944, 3205253945, 3205253950, 3205253951]
  },
  {
    storyHash: 3655015216, // Pride
    activities: [1907493624, 1907493625, 1907493630, 1907493631]
  },
  {
    storyHash: 4003594394, // Insanity
    activities: [2639701096, 2639701097, 2639701102, 2639701103]
  }
];

class NightmareHunts extends React.Component {
  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    // const nightmareStrings = Object.values(manifest.DestinyActivityDefinition).filter(a => a.destinationHash === 290444260 && a.directActivityModeType === 2 && a.displayProperties?.name && a.displayProperties?.name !== '' && a.displayProperties.name.indexOf('Nightmare') > -1);

    // const lol = nightmareStrings.map(def => {
    //   return (`{
    //     storyHash: ${def.hash},    // ${def.displayProperties.name.replace('Nightmare Hunt: ', '')}
    //     activities: ${JSON.stringify(Object.values(manifest.DestinyActivityDefinition).filter(a => a.destinationHash === 290444260 && a.hash !== def.hash && a.displayProperties?.name && a.displayProperties?.name !== '' && a.displayProperties.name.indexOf(def.displayProperties.name) > -1).map(d => d.hash))}
    //   }`)
    // }).join(',\n')

    //const activeHunts = characterActivities[member.characterId].availableActivities.filter(a => nightmareHunts.find(h => h.activities.includes(a.activityHash)));
    const activeHunts = nightmareHunts.filter(h => h.activities.find(a => characterActivities[member.characterId].availableActivities.find(c => c.activityHash === a)));

    // console.log(activeHunts);

    return (
      <div className='user-module nightmare-hunts'>
        <div className='sub-header'>
          <div>{manifest.DestinyDestinationDefinition[290444260].displayProperties?.name}</div>
        </div>
        <h3>{t('Nightmare Hunts')}</h3>
        <div className='text'>
          <p>{t('Your most feared, devastating, tormenting nightmares reincarnate―be immovable in your resolve, Guardian.')}</p>
          <p>
            <em>{t(`Hunt down this week's available nightmares for... satisfaction.`)}</em>
          </p>
        </div>
        <h4>{t('Available activities')}</h4>
        <ul className='list activities'>
          {activeHunts.map((a, i) => {

            const masterHash = orderBy(a.activities, [hash => manifest.DestinyActivityDefinition[hash].activityLightLevel], ['asc'])?.[0];

            const definitionActivity = manifest.DestinyActivityDefinition[masterHash];
            
            return (
              <li key={i} className='linked tooltip' data-table='DestinyActivityDefinition' data-hash={definitionActivity.hash} data-mode='175275639'>
                <div className='name'>{manifest.DestinyActivityDefinition[a.storyHash]?.displayProperties.name.replace('Nightmare Hunt: ', '')}</div>
              </li>
            )
          })}
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

export default compose(connect(mapStateToProps), withTranslation())(NightmareHunts);
