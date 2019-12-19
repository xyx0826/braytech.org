import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../utils/manifest';

import './styles.css';

import { ReactComponent as ArcadianValley } from '../../../media/destinations/svg/arcadian-valley-2_monochrome.svg';
import { ReactComponent as NewPacificArcology } from '../../../media/destinations/svg/new-pacific-arcology-2_monochrome.svg';
import { ReactComponent as EuropeanDeadZone } from '../../../media/destinations/svg/european-dead-zone-1_monochrome.svg';
import { ReactComponent as TheTangledShore } from '../../../media/destinations/svg/the-tangled-shore-1_monochrome.svg';
import { ReactComponent as HellasBasin } from '../../../media/destinations/svg/hellas-basin-1_monochrome.svg';
import { ReactComponent as FieldsOfGlass } from '../../../media/destinations/svg/fields-of-glass-1_monochrome.svg';

const icons = {
  126924919: ArcadianValley,
  2388758973: NewPacificArcology,
  1199524104: EuropeanDeadZone,
  359854275: TheTangledShore,
  308080871: HellasBasin,
  1993421442: FieldsOfGlass
}

class Flashpoint extends React.Component {
  render() {
    const { t, member } = this.props;
    const milestones = member.data.milestones;
    const definitionMilestoneFlashpoint = manifest.DestinyMilestoneDefinition[463010297];
    const milestoneFlashpointQuestItem = milestones[463010297].availableQuests && milestones[463010297].availableQuests.length && manifest.DestinyMilestoneDefinition[463010297].quests[milestones[463010297].availableQuests[0].questItemHash];
    const definitionFlashpointVendor =
      milestoneFlashpointQuestItem &&
      Object.values(manifest.DestinyVendorDefinition).find(v => {
        return v.locations?.find(l => l.destinationHash === milestoneFlashpointQuestItem.destinationHash && ![880202832].includes(v.hash));
      });
    const definitionFlashpointFaction = definitionFlashpointVendor && manifest.DestinyFactionDefinition[definitionFlashpointVendor.factionHash];

    const Icon = icons[milestoneFlashpointQuestItem.destinationHash] || null;

    return (
      <div className='flashpoint'>
        <div className='icon'>
          {Icon && <Icon />}
        </div>
        <div className='page-header'>
          <div className='sub-name'>{definitionMilestoneFlashpoint.displayProperties && definitionMilestoneFlashpoint.displayProperties.name}</div>
          <div className='name'>{manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name}</div>
        </div>
        {definitionFlashpointVendor && definitionFlashpointVendor.displayProperties ? (
          <div className='text'>
            <p>{t('{{vendorName}} is waiting for you at {{destinationName}}.', { vendorName: definitionFlashpointVendor.displayProperties && definitionFlashpointVendor.displayProperties.name, destinationName: manifest.DestinyDestinationDefinition[milestoneFlashpointQuestItem.destinationHash].displayProperties.name })}</p>
            <p>
              <em>{definitionFlashpointFaction.displayProperties.description}</em>
            </p>
          </div>
        ) : (
          <div className='info'>{t('Beep-boop?')}</div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(
    mapStateToProps
  ),
  withTranslation()
)(Flashpoint);
