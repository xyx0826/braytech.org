import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';

import manifest from '../../utils/manifest';
import MemberLink from '../../components/MemberLink';
import userFlair from '../../data/userFlair';
import Button from '../../components/UI/Button';
import { ReactComponent as Logo } from '../../components/BraytechDevice.svg';
import { ReactComponent as Patreon } from '../../components/PatreonDevice.svg';
import captainsLog from '../../data/captainsLog';

import './styles.css';

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      log: 0
    };

    this.logs = captainsLog.slice().reverse();
    this.supporters = this.shuffle(userFlair.slice().filter(m => m.trophies.find(t => t.classnames.includes('patron'))));
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  logPrevious = e => {
    if (this.state.log + 1 === this.logs.length) {
      return;
    }
    this.setState(prev => ({
      log: prev.log + 1
    }));
  };

  logNext = e => {
    if (this.state.log === 0) {
      return;
    }
    this.setState(prev => ({
      log: prev.log - 1
    }));
  };

  render() {
    const { t } = this.props;

    return (
      <div className='view' id='index'>
        <div className='row flash'>
          <div className='wrapper'>
            <div className='device'>
              <Logo />
            </div>
            <div className='big-name'>BRAYTECH</div>
          </div>
        </div>
        <div className='row patreon-cta'>
          <div className='wrapper'>
            <div className='device'>
              <Patreon />
            </div>
            <Button
              text={t('Become a Patron')}
              action={() => {
                window.open('https://www.patreon.com/braytech', '_blank');
              }}
            />
          </div>
        </div>
        <div className='row about'>
          <div className='wrapper'>
            <div className='module'>
              <h3>{t('What is Braytech')}</h3>
              <div className='description'>
                <p>Braytech is a Destiny fan site with many features. The exhaustive list includes but is not limited to; a clan roster with admin mode, collections and triumphs as per the game itself with some extra bells and whistles, a curated “this week” view detailing end-games chases and their conditions, exhaustive checklists with links to maps, post game carnage reports with details on activities and their participants, a pursuits view for bounties and quests which are supplemented with extra curated data, and a bunch of other stuff too.</p>
                <p>Destiny is a game for all Guardians, available in various languages. So is Braytech. It’s beautiful on both desktop computers and smaller touch devices, accessible by anyone from anywhere.</p>
                <p>The name, Braytech, is that which Clovis Bray, one of several of the franchise's fictional entities, designates their consumer products line; weapons, armour, etc. As such, I thought it fitting as a name for what I endeavour to be one of Destiny’s best third party resources.</p>
              </div>
            </div>
            <div className='module'>
              <h3>{t('Who builds it')}</h3>
              <div className='description'>
                <p>An Australian web developer does. Hi, my name's Tom, and I'm addicted to Destiny. Okay, so not addicted—I've had time to build this web site. Truthfully, I'm an avid Destiny enthusiast who needs both an outlet for letting off steam and for developing my web skills further for use in my professional activities.</p>
                <p>Braytech is a stringent exercise in mimicking—and to a small degree, reimagining—Destiny's UI for web and mobile. This has been my first React project, the first time I've heavily used the command line, the first time I've had to use NPM... And it's been super fun and rewarding, most of the time!</p>
              </div>
            </div>
            {manifest.statistics.general ? (
              <div className='module stats'>
                <h3>{t('VOLUSPA statistics')}</h3>
                <div className='description'>
                  <p>The name, Braytech, is that which Clovis Bray, one of several of the franchise's fictional entities, designates their consumer products line; weapons, armour, etc. As such, I thought it fitting as a name for what I endeavour to be one of Destiny’s best third party resources.</p>
                </div>
                <ul>
                  <li>
                    <div className='value'>{manifest.statistics.general.tracking.toLocaleString()}</div>
                    <div className='name'>Tracked players</div>
                    <div className='description'>
                      <p>Number of players VOLUSPA is tracking through their activities and accomplishments</p>
                    </div>
                  </li>
                  <li>
                    <div className='value'>{manifest.statistics.general.playedSeason.toLocaleString()}</div>
                    <div className='name'>Played season</div>
                    <div className='description'>
                      <p>Number of tracked players who've played this season</p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className='row patreon'>
          <div className='wrapper'>
            <div className='device'>
              <Patreon />
            </div>
            <div className='module'>
              <h3>{t('How you can help')}</h3>
              <div className='description'>
                <p>Building these beautiful interfaces and fencing with Bungie's APIs takes effort and time. I can only devote so much of it to hobby ventures, which also cost money to keep online. I have a firm stance against ads on web sites as we know them. As such, I prefer to support these projects out of my own pocket and depend on the generosity of my community.</p>
                <p>By supporting me, you can help ensure that I can keep these projects online, as well as help enable me to continue adding cool new features.</p>
              </div>
              <Button
                text={t('Become a Patron')}
                action={() => {
                  window.open('https://www.patreon.com/braytech', '_blank');
                }}
              />
            </div>
            <div className='module tags'>
              {this.supporters.map((m, k) => {
                let t = m.user.slice(0, 1);
                let i = m.user.slice(1);
                return <MemberLink key={k} type={t} id={i} hideFlair />;
              })}
            </div>
          </div>
        </div>
        <div className='row changes'>
          <div className='wrapper'>
            <div className='meta'>
              <h3>{t('Change log')}</h3>
              <div className='text'>
                <div className='number'>{this.logs[this.state.log].version}</div>
                <div className='time'>
                  <Moment fromNow withTitle>{this.logs[this.state.log].date}</Moment>
                </div>
              </div>
              <div className='buttons'>
                <Button text={t('Older')} action={this.logPrevious} disabled={this.state.log + 1 === this.logs.length ? true : false} />
                <Button text={t('Newer')} action={this.logNext} disabled={this.state.log === 0 ? true : false} />
              </div>
            </div>
            <ReactMarkdown className='log-content' source={this.logs[this.state.log].content} />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withTranslation()
)(Index);
