import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy, groupBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as bungie from '../../../utils/bungie';
import { Button, DestinyKey } from '../../UI/Button';
import MemberLink from '../../MemberLink';

// import ReportPlayer from '../ReportPlayer';
import { ReportHeader, ReportHeaderLarge } from './ReportHeader';
import { EntryHeader, EntryRow } from './EntryRow';

import './styles.css';

class ReportItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedReport: Boolean(this.props.expanded),
      expandedPlayers: ['2305843009260574394'],
      playerCache: []
    };
  }

  handler_expand = e => {
    this.setState(p => ({
      ...p,
      expandedReport: true
    }));

    this.updatePlayerCache();
  };

  handler_contract = e => {
    this.setState(p => ({
      ...p,
      expandedReport: false,
      expandedPlayers: []
    }));
  };

  updatePlayerCache = () => {
    const { report } = this.props;

    if (report) {
      report.entries.forEach(async e => {
        const progression = await this.getProgression(e.player.destinyUserInfo.membershipType, e.player.destinyUserInfo.membershipId, e.characterId);

        if (this.mounted) {
          this.setState(p => ({
            ...p,
            playerCache: [
              ...p.playerCache,
              {
                membershipId: e.player.destinyUserInfo.membershipId,
                ...progression.points,
                ...progression.resets
              }
            ]
          })); 
        }
      });
    }
  };

  getProgression = async (membershipType, membershipId, characterId) => {
    let response = await bungie.GetProfile({
      params: {
        membershipType,
        membershipId,
        components: '202,900'
      }
    });

    if (!response || (response && response.ErrorCode !== 1) || (response && response.ErrorCode === 1 && !response.Response.characterProgressions.data)) {
      return {
        points: {
          
        },
        resets: {
          
        }
      };
    }

    const characterProgressions = response.Response.characterProgressions.data;
    const characterRecords = response.Response.characterRecords.data;
    const profileRecords = response.Response.profileRecords.data.records;

    const gloryPoints = characterProgressions[characterId].progressions[2000925172].currentProgress.toLocaleString();
    const valorPoints = characterProgressions[characterId].progressions[2626549951].currentProgress.toLocaleString();
    const infamyPoints = characterProgressions[characterId].progressions[2772425241].currentProgress.toLocaleString();

    const infamySeasons = [{ recordHash: 3901785488, objectiveHash: 4210654397 }].map(season => {

      const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

      const recordScope = definitionRecord.scope || 0;
      const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

      season.resets = (recordData && recordData.objectives && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash) && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash).progress) || 0;

      return season;
    });

    const valorSeasons = [
      {
        recordHash: 1341325320,
        objectiveHash: 1089010148
      },
      {
        recordHash: 2462707519,
        objectiveHash: 2048068317
      },
      {
        recordHash: 3666883430,
        objectiveHash: 3211089622
      },
      {
        recordHash: 2110987253,
        objectiveHash: 1898743615
      },
      {
        recordHash: 510151900,
        objectiveHash: 2011701344
      }
    ].map(season => {

      const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

      const recordScope = definitionRecord.scope || 0;
      const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

      season.resets = (recordData && recordData.objectives && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash) && recordData.objectives.find(o => o.objectiveHash === season.objectiveHash).progress) || 0;

      return season;
    });

    const valorResets = valorSeasons.reduce((a, v) => a + v.resets, 0).toLocaleString();
    const infamyResets = infamySeasons.reduce((a, v) => a + v.resets, 0).toLocaleString();
    
    return {
      points: {
        gloryPoints,
        valorPoints,
        infamyPoints
      },
      resets: {
        valorResets,
        infamyResets
      }
    };
  };

  handler_togglePlayer = characterId => e => {
    const { expandedPlayers } = this.state;

    if (expandedPlayers.includes(characterId)) {
      this.setState(p => ({
        ...p,
        expandedPlayers: [
          ...p.expandedPlayers.filter(c => c !== characterId)
        ]
      }));
    } else {
      this.setState(p => ({
        ...p,
        expandedPlayers: [
          ...p.expandedPlayers,
          characterId
        ]
      }));
    }
  };

  componentDidMount() {
    this.mounted = true;

    if (this.props.expanded) {
      this.updatePlayerCache();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expandedReport !== this.state.expandedReport || prevState.expandedPlayers !== this.state.expandedPlayers) {
      console.log('rebinding tooltips for report item')
      this.props.rebindTooltips();
    }
  }

  render() {
    const { t, member, report, expanded } = this.props;

    const characters = member.data && member.data.profile.characters.data;
    const characterIds = characters && characters.map(c => c.characterId);

    const { expandedReport, expandedPlayers, playerCache } = this.state;

    

   
    // if (expandedReport) console.log(this.props);

    const entry = characterIds && report.entries.find(entry => characterIds.includes(entry.characterId));
    const standing = entry && entry.values.standing && entry.values.standing.basic.value !== undefined ? entry.values.standing.basic.value : -1;








    const entries = report.entries.map(entry => {
      const dnf = entry.values.completed.basic.value === 0 ? true : false;
      const isExpandedPlayer = expandedPlayers.includes(entry.characterId);
      console.log(entry)
      return {
        teamId: report.teams && report.teams.length ? entry.values.team.basic.value : null,
        fireteamId: entry.values.fireteamId ? entry.values.fireteamId.basic.value : null,
        element: (
          <li key={entry.characterId} className={cx('linked', { isExpandedPlayer })} onClick={this.handler_togglePlayer(entry.characterId)}>
            <div className={cx('inline', { dnf: dnf })}>
              <div className='member'>
                <MemberLink type={entry.player.destinyUserInfo.membershipType} id={entry.player.destinyUserInfo.membershipId} displayName={entry.player.destinyUserInfo.displayName} characterId={entry.characterId} />
              </div>
              <EntryHeader activityDetails={report.activityDetails} entry={entry} playerCache={playerCache} />
            </div>
            <EntryRow activityDetails={report.activityDetails} entry={entry} playerCache={playerCache} />
          </li>
        )
      };
    });



    const detail = (
      <>
        <ReportHeaderLarge characterIds={characterIds} {...report} />
        <div className='entries'>
          {report.teams && report.teams.length ? (
            orderBy(report.teams, [t => t.score.basic.value], ['desc']).map(team => {
              const fireteams = Object.values(groupBy(entries.filter(e => e.teamId === team.teamId), 'fireteamId'));

              return (
                <ul key={team.teamId} className='team'>
                  <li className={cx('team-head', team.teamId === 17 ? 'alpha' : 'bravo')}>
                    <div className='team name'>{team.teamId === 17 ? t('Alpha team') : t('Bravo team')}</div>
                    <EntryHeader activityDetails={report.activityDetails} team />                    
                    <div className='team score hideInline'>{team.score.basic.displayValue}</div>
                  </li>
                  {fireteams.map((f, i) => {
                    return (
                      <li key={i}>
                        <ul className={cx('list', 'fireteam', { stacked: f.length > 1 })}>{f.map(e => e.element)}</ul>
                      </li>
                    );
                  })}
                </ul>
              );
            })
          ) : (
            <ul className='team'>
              <li className={cx('team-head')}>
                <div className='team name' />
                <EntryHeader activityDetails={report.activityDetails} team />
                <div className='team score hideInline' />
              </li>
              {Object.values(groupBy(entries, 'fireteamId')).map((f, i) => {
                return (
                  <li key={i}>
                    <ul className={cx('list', 'fireteam', { stacked: f.length > 1 })}>{f.map(e => e.element)}</ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!expanded && (
          <div className='sticky-nav inline'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <a className='button' href={`/pgcr/${report.activityDetails.instanceId}`} target='_blank'>
                    <DestinyKey type='more' />
                    {t('New tab')}
                  </a>
                </li>
                <li>
                  <Button action={this.handler_contract}>
                    <DestinyKey type='dismiss' />
                    {t('Close')}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </>
    );

    return (
      <li key={report.activityDetails.instanceId} className={cx('linked', { isExpanded: expandedReport, standing: standing > -1, victory: standing === 0 })} onClick={!expandedReport ? this.handler_expand : undefined}>
      {!expandedReport ? <ReportHeader characterIds={characterIds} {...report} /> : detail}
      </li>
    );
    
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
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

ReportItem = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(ReportItem);

export default ReportItem;

export { ReportItem };
