import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../utils/manifest';
import Items from '../../../components/Items';

import combos from '../../../data/chaliceData';

import './styles.css';

class ChaliceRecipesDebug extends React.Component {
  chalice = manifest.DestinyInventoryItemDefinition[1115550924];

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <>
        <div className='module head'>
          <div className='page-header'>
          <div className='sub-name'>{this.chalice.itemTypeDisplayName}</div>
              <div className='name'>{this.chalice.displayProperties.name}</div>
          </div>
        </div>
        <div className='buff'>
          {this.props.nav}
          <div className='debug module'>
            {combos.map((c, i) => (
              <div key={i} className='combo'>
                <div>
                  <ul className='list inventory-items'>
                    <Items items={c.combo.flat().map(i => ({ itemHash: i }))} />
                  </ul>
                </div>
                <div>
                  <ul className='list inventory-items'>
                    <Items items={c.items.map(i => ({ itemHash: i }))} />
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(null, mapDispatchToProps), withTranslation())(ChaliceRecipesDebug);
