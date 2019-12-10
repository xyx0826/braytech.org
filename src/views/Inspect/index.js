import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter, Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import * as utils from '../../utils/destinyUtils';
import ObservedImage from '../../components/ObservedImage';
import { DestinyKey } from '../../components/UI/Button';

import { sockets } from '../../utils/destinyItems/sockets';
import { stats, statsMs } from '../../utils/destinyItems/stats';
import { masterwork } from '../../utils/destinyItems/masterwork';

import Scene from '../../components/Three/Inspect/Scene';

import './styles.css';

class Inspect extends React.Component {
  state = {
    ornamentHash: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handler_setOrnamentHash = hash => e => {
    this.setState({
      ornamentHash: hash
    });
  };

  render() {
    const { t, member, three } = this.props;

    const returnPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    const item = {
      itemHash: this.props.match.params.hash,
      itemInstanceId: false,
      itemComponents: false
    };

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

    item.sockets = sockets(item);
    item.stats = stats(item);
    item.masterwork = masterwork(item);

    console.log(item);

    const preparedSockets =
      item.sockets &&
      item.sockets.sockets &&
      item.sockets.socketCategories.reduce((a, v) => {
        v.sockets.forEach(s => {
          if (s.plugOptions.filter(p => p.isOrnament).length) {
            s.plugOptions.splice(0, 0, s.plug);
          }
        });

        const modCategory = a.find(c => c.category.categoryStyle === 2);

        if (modCategory) {
          modCategory.sockets.push(...v.sockets);

          return a;
        } else {
          return [...a, v];
        }
      }, []);

    return (
      <>
        <div className='view' id='inspect'>
          {three.enabled ? (
            <Scene itemHash={definitionItem.hash} ornamentHash={this.state.ornamentHash} {...three} />
          ) : definitionItem.screenshot && definitionItem.screenshot !== '' ? (
            <div className='screenshot'>
              <ObservedImage src={`https://www.bungie.net${definitionItem.screenshot}`} />
            </div>
          ) : null}
          {definitionItem.secondaryIcon && definitionItem.secondaryIcon !== '/img/misc/missing_icon_d2.png' && definitionItem.secondaryIcon !== '' ? (
            <div className='foundry'>
              <ObservedImage src={`https://www.bungie.net${definitionItem.secondaryIcon}`} />
            </div>
          ) : null}
          <div className='row header'>
            <div className={cx('rarity', utils.itemRarityToString(definitionItem.inventory.tierType))} />
            <div className='icon'>{definitionItem.displayProperties.icon ? <ObservedImage src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} /> : null}</div>
            <div className='text'>
              <div className='name'>{definitionItem.displayProperties.name}</div>
              <div className='type'>{definitionItem.itemTypeDisplayName}</div>
            </div>
            <div className='flair'>{definitionItem.displayProperties.description}</div>
          </div>
          {item.sockets && item.sockets.sockets ? (
            <div className='sockets'>
              {preparedSockets.map((c, i) => {
                return (
                  <div className={cx('row', 'category', { mods: c.category.categoryStyle === 2 })} key={i}>
                    <div className='category-name'>{c.category.displayProperties.name}</div>
                    <div className='category-sockets'>
                      {c.sockets
                        .filter(s => !s.isTracker)
                        .map((s, i) => {
                          return (
                            <div className={cx('socket', { intrinsic: s.isIntrinsic, columned: s.plugOptions.length > 10 })} key={i}>
                              {s.plugOptions.map((p, i) => {
                                return (
                                  <div className={cx('plug', 'tooltip', { active: p.isActive })} data-hash={p.plugItem.hash} key={i} onClick={this.handler_setOrnamentHash(p.plugItem.hash)}>
                                    <div className='icon'>
                                      <ObservedImage src={`https://www.bungie.net${p.plugItem.displayProperties.icon}`} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <Link className='button' to={returnPath}>
                  <DestinyKey type='dismiss' />
                  {t('Dismiss')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    three: state.three
  };
}

export default compose(connect(mapStateToProps), withTranslation(), withRouter)(Inspect);
