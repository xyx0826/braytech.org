import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy, groupBy } from 'lodash';
import Moment from 'react-moment';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { itemComponents } from '../../utils/destinyItems/itemComponents';
import ObservedImage from '../../components/ObservedImage';
import { NoAuth, DiffProfile } from '../../components/BungieAuth';
import { ProfileLink } from '../../components/ProfileLink';
import Spinner from '../../components/UI/Spinner';
import ProgressBar from '../../components/UI/ProgressBar';
import { DestinyKey } from '../../components/UI/Button';
import Items from '../../components/Items';

import './styles.css';

class BountyTracker extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hash !== this.props.hash) {
      window.scrollTo(0, 0);
      this.props.rebindTooltips();
    }
  }

  process = (items = [], isQuest = false, enableTooltip = true) => {
    const { t, member, viewport } = this.props;

    const nowMs = new Date().getTime();

    return items
      .map((item, i) => {
        const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
        const definitionBucket = item.bucketHash ? manifest.DestinyInventoryBucketDefinition[item.bucketHash] : false;

        if (!definitionItem) {
          console.log(`Items: Couldn't find item definition for ${item.itemHash}`);
          return false;
        }

        item.itemComponents = itemComponents(item, member);

        if (item.itemComponents?.objectives && item.itemComponents?.objectives.filter(o => !o.complete).length === 0) {
          return false;
        }

        const expirationDate = item.itemComponents.item?.expirationDate;
        const timestamp = expirationDate && new Date().getTime();
        const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

        const bucketName = definitionBucket?.displayProperties?.name?.replace(' ', '-').toLowerCase();
        const vendorSource = Object.keys(manifest.DestinyVendorDefinition).find(key => manifest.DestinyVendorDefinition[key].itemList?.find(i => i.itemHash === item.itemHash));

        const objectives = [];
        definitionItem.objectives &&
          definitionItem.objectives.objectiveHashes.forEach(hash => {
            const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

            const instanceProgressObjective = item.itemComponents?.objectives?.length && item.itemComponents.objectives.find(o => o.objectiveHash === hash);

            let playerProgress = {
              complete: false,
              progress: 0,
              objectiveHash: definitionObjective.hash
            };

            playerProgress = { ...playerProgress, ...instanceProgressObjective };

            objectives.push(<ProgressBar key={definitionObjective.hash} objectiveHash={definitionObjective.hash} {...playerProgress} />);
          });

        return {
          ...item,
          name: definitionItem.displayProperties?.name,
          rarity: definitionItem.inventory?.tierType,
          vendorSource,
          timestampExpiry: timestampExpiry || 10000 * 10000 * 10000 * 10000,
          el: (
            <li key={item.itemHash}>
              <ul>
                <li className='bounty-item'>
                  <ul className='list inventory-items'>
                    <li
                      className={cx(
                        {
                          linked: true,
                          masterworked: enums.enumerateItemState(item.state).masterworked,
                          tooltip: (enableTooltip && viewport.width > 600) || (enableTooltip && !isQuest),
                          exotic: definitionItem.inventory?.tierType === 6
                        },
                        bucketName
                      )}
                      data-hash={item.itemHash}
                      data-instanceid={item.itemInstanceId}
                      data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                    >
                      <div className='icon'>
                        <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                      </div>
                      {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory?.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
                      {item.itemComponents?.objectives && item.itemComponents?.objectives.filter(o => !o.complete).length === 0 ? <div className='completed' /> : null}
                      {item.itemComponents?.objectives && item.itemComponents?.objectives.filter(o => !o.complete).length > 0 && nowMs + 7200 * 1000 > timestampExpiry ? <div className='expires-soon' /> : null}
                      {item.itemComponents?.objectives && item.itemComponents?.objectives.filter(o => !o.complete).length > 0 ? (
                        <ProgressBar
                          objectiveHash={item.itemComponents?.objectives[0].objectiveHash}
                          progress={item.itemComponents?.objectives.reduce((acc, curr) => {
                            return acc + curr.progress;
                          }, 0)}
                          completionValue={item.itemComponents?.objectives.reduce((acc, curr) => {
                            return acc + curr.completionValue;
                          }, 0)}
                          hideCheck
                        />
                      ) : null}
                    </li>
                  </ul>
                </li>
                <li className='text'>
                  <div className='name'>{definitionItem.displayProperties?.name}</div>
                  <div className='description'>
                    <pre>{definitionItem.displayProperties?.description}</pre>
                  </div>
                </li>
                {/* <li className='source'>{manifest.DestinyVendorDefinition[vendorSource]?.displayProperties?.name}</li> */}
                <li className='objectives'>{objectives}</li>
                <li className='reward-items'>
                  <ul className='list inventory-items'>
                    <Items items={definitionItem.value.itemValue.filter(i => i.itemHash !== 0)} noBorder hideQuantity />
                  </ul>
                </li>
                <li className='expires'>
                  {item.itemComponents?.objectives?.length && item.itemComponents.objectives.filter(o => !o.complete).length > 0 && expirationDate ? (
                    timestampExpiry > timestamp ? (
                      <>
                        {t('Expires')} <Moment fromNow>{expirationDate}</Moment>.
                      </>
                    ) : (
                      <>{t('Expired')}.</>
                    )
                  ) : null}
                </li>
              </ul>
            </li>
          )
        };
      })
      .filter(i => i);
  };

  render() {
    const { t, member, auth } = this.props;
    const order = this.props.match.params.order || 'rarity';

    if (!auth) {
      return <NoAuth />;
    }

    if (auth && !auth.destinyMemberships.find(m => m.membershipId === member.membershipId)) {
      return <DiffProfile />;
    }

    if (auth && auth.destinyMemberships.find(m => m.membershipId === member.membershipId) && !member.data.profile.profileInventory) {
      return (
        <div className='view' id='bounty-tracker'>
          <Spinner />
        </div>
      );
    }

    const inventory = member.data.profile.profileInventory.data.items
      .slice()
      .concat(member.data.profile.characterInventories.data[member.characterId].items)
      .map(i => ({ ...manifest.DestinyInventoryItemDefinition[i.itemHash], ...i }));

    const filteredInventory = inventory
      .filter(i => i.bucketHash === 1345459588)
      .concat(
        // Include prophecy tablets, which are in consumables
        inventory.filter(i => i.bucketHash === 1469714392).filter(i => i.itemCategoryHashes.includes(2250046497))
      );

    const constructed = groupBy(filteredInventory, item => {
      if (item.itemCategoryHashes.includes(16) || item.itemCategoryHashes.includes(2250046497) || (item.objectives && item.objectives.questlineItemHash)) {
        return 'quests';
      }
      if (!item.objectives || item.objectives.length === 0 || item.sockets) {
        return 'items';
      }

      return 'bounties';
    });

    const bounties = orderBy(this.process(constructed.bounties), [i => i.timestampExpiry, i => i[order], i => i.name], ['asc', 'desc', 'asc']);

    return (
      <>
        <div className='view' id='bounty-tracker'>
          {bounties.length ? (
            <ul className='list bounties'>{bounties.map(i => i.el)}</ul>
          ) : (
            <div className='aside'>
              <p>{t("No bounties. Go and see if there's anything you can do for Failsafe. If nothing else, keep her company...")}</p>
            </div>
          )}
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <ProfileLink className='button' to='/quests'>
                  <DestinyKey type='dismiss' />
                  {t('Back')}
                </ProfileLink>
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
    auth: state.auth,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(BountyTracker);
