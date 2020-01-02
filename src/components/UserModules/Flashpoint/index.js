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

const iconMap = {
  126924919: ArcadianValley,
  2388758973: NewPacificArcology,
  1199524104: EuropeanDeadZone,
  359854275: TheTangledShore,
  308080871: HellasBasin,
  1993421442: FieldsOfGlass
};

const vendorMap = {
  126924919: 1576276905,
  2388758973: 1062861569,
  1199524104: 396892126,
  359854275: 863940356,
  308080871: 1735426333,
  1993421442: 2398407866
};

const vendorBubbleMap = {
  1576276905: 1576276905,
  1062861569: 1291433366,
  396892126: 3091570009,
  863940356: 1608679832,
  1735426333: 1461622515,
  2398407866: 2822410613
};

class Flashpoint extends React.Component {
  render() {
    const { t, member } = this.props;
    const milestones = member.data.milestones;

    const definitionMilestoneFlashpoint = manifest.DestinyMilestoneDefinition[463010297];
    const milestoneFlashpointQuestItem = milestones[463010297].availableQuests && milestones[463010297].availableQuests.length && manifest.DestinyMilestoneDefinition[463010297].quests[milestones[463010297].availableQuests[0].questItemHash];
    const destinationHash = milestoneFlashpointQuestItem.destinationHash;

    const definitionFlashpointVendor = vendorMap[destinationHash] && manifest.DestinyVendorDefinition[vendorMap[destinationHash]];
    const definitionFlashpointFaction = definitionFlashpointVendor && manifest.DestinyFactionDefinition[definitionFlashpointVendor.factionHash];

    const Icon = iconMap[destinationHash] || null;

    const vendorName = definitionFlashpointVendor && definitionFlashpointVendor.displayProperties?.name;
    const locationName = manifest.DestinyDestinationDefinition[destinationHash]?.bubbles.find(b => b.hash === vendorBubbleMap[definitionFlashpointVendor.hash])?.displayProperties?.name;

    return (
      <div className='user-module flashpoint'>
        <div className='icon'>{Icon && <Icon />}</div>
        <div className='page-header'>
          <div className='sub-name'>{definitionMilestoneFlashpoint.displayProperties && definitionMilestoneFlashpoint.displayProperties.name}</div>
          <div className='name'>{manifest.DestinyDestinationDefinition[destinationHash].displayProperties.name}</div>
        </div>
        {definitionFlashpointVendor && definitionFlashpointVendor.displayProperties ? (
          <div className='text'>
            <p>{t('{{vendorName}} is waiting for you at {{destinationName}}.', { vendorName, destinationName: locationName })}</p>
            <p>
              <em>{definitionFlashpointFaction?.displayProperties?.description}</em>
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

export default compose(connect(mapStateToProps), withTranslation())(Flashpoint);
