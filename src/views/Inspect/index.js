import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import * as utils from '../../utils/destinyUtils';
import { damageTypeToString, ammoTypeToString, breakerTypeToIcon } from '../../utils/destinyUtils';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats, statsMs } from '../../utils/destinyItems/stats';
import { masterwork } from '../../utils/destinyItems/masterwork';
import ObservedImage from '../../components/ObservedImage';

import Scene from '../../components/Three/Inspect/Scene';

import './styles.css';

class Inspect extends React.Component {
  state = {}

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, member, tooltips } = this.props;

    const definitionItem = manifest.DestinyInventoryItemDefinition[this.props.match.params.hash];

    

    return (
      <div className='view' id='inspect'>
        <div className='row header'>
          <div className={cx('rarity', utils.itemRarityToString(definitionItem.inventory.tierType))} />
          <div className='icon'>{definitionItem.displayProperties.icon ? <ObservedImage className='image' src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} /> : null}</div>
          <div className='text'>
            <div className='name'>{definitionItem.displayProperties.name}</div>
            <div className='type'>{definitionItem.itemTypeDisplayName}</div>
            <div className='description'>{definitionItem.displayProperties.description}</div>
          </div>
        </div>
        <Scene itemHash={definitionItem.hash} />
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
  connect(mapStateToProps),
  withTranslation()
)(Inspect);
