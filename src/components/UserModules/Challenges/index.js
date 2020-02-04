import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { groupBy } from 'lodash';
import cx from 'classnames';

import * as enums from '../../../utils/destinyEnums';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

const groups = [[2498962144, 2443315975]];

class Challenges extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getOverrides(activityHash) {
    const isNightmareHunt = enums.nightmareHunts.find(n => n.activities.indexOf(activityHash) > -1);

    if (isNightmareHunt) {
      return {
        name: this.props.t('Nightmare Hunts'),
        description: this.props.t('Your most feared, devastating, tormenting nightmares reincarnate―be immovable in your resolve, Guardian.')
      };
    }
  }

  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    // console.log(groupBy(characterActivities[member.characterId].availableActivities.filter(a => a.challenges), a => a.challenges[0].objective.objectiveHash))

    const activities = characterActivities[member.characterId].availableActivities
      .filter(a => a.challenges)
      .reduce((a, v) => [...a, ...(v.challenges.filter(c => !a.filter(b => b.objectiveHash === c.objective.objectiveHash).length).map(c => c.objective) || [])], [])
      .reduce((a, v) => {
        const group = groups.find(g => g.indexOf(v.objectiveHash) > -1);

        if (group) {
          const indexOf = a.findIndex(g => g.objectives.filter(h => group.indexOf(h.objectiveHash) > -1).length);

          if (indexOf > -1) {
            a[indexOf].objectives = [...a[indexOf].objectives, v];

            return a;
          } else {
            return [
              ...a,
              {
                activityHash: v.activityHash,
                objectives: [v]
              }
            ];
          }
        } else {
          return [
            ...a,
            {
              activityHash: v.activityHash,
              objectives: [v]
            }
          ];
        }
      }, []);

    console.log(activities);

    return (
      <div className='user-module challenges'>
        <div className='sub-header'>
          <div>{t('Challenges')}</div>
        </div>
        <div className='text'>
          <p>
            <em>{t('')}</em>
          </p>
        </div>
        <ul>
          {activities
            .filter(a => a.objectives.filter(o => !o.complete).length)
            .map((challenge, i) => {
              const override = this.getOverrides(challenge.activityHash);

              const activityName = override?.name || manifest.DestinyActivityDefinition[challenge.activityHash].originalDisplayProperties?.name || manifest.DestinyActivityDefinition[challenge.activityHash].displayProperties.name;
              const activitydescription = override?.description || manifest.DestinyActivityDefinition[challenge.activityHash].originalDisplayProperties?.description || manifest.DestinyActivityDefinition[challenge.activityHash].displayProperties.description;

              return (
                <li key={i}>
                  <div className='activity'>
                    <div className='icon' />
                    <div className='text'>
                      <div className='name'>{activityName}</div>
                      <div className='description'>
                        <p>{activitydescription}</p>
                      </div>
                    </div>
                  </div>
                  <div className={cx('challenges', { completed: !challenge.objectives.filter(o => !o.complete).length })}>
                    {challenge.objectives.map((objective, o) => (
                      <div key={o} className='challenge'>
                        <div className='text'>
                          <p>{manifest.DestinyObjectiveDefinition[objective.objectiveHash].displayProperties.description}</p>
                        </div>
                        <ProgressBar key={o} {...objective} />
                      </div>
                    ))}
                  </div>
                </li>
              );
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

export default compose(connect(mapStateToProps), withTranslation())(Challenges);
