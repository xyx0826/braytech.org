import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import manifest from '../../utils/manifest';
import { ReactComponent as HighlightThisWeek } from '../../svg/miscellaneous/highlight-this-week.svg';
import { markdown_linkHelper } from '../../utils/misc';

import './styles.css';

export function NavLinks(props) {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon' />
          <NavLink to='/archives' exact />
        </li>
        <li className='linked'>
          <div className='icon manifest' />
          <NavLink to='/archives/manifest' exact />
        </li>
        <li className='linked'>
          <div className='icon eververse' />
          <NavLink to='/archives/eververse' exact />
        </li>
        <li className='linked'>
          <div className='icon chalice-of-opulence' />
          <NavLink to='/archives/chalice-of-opulence' />
        </li>
      </ul>
    </div>
  );
}

class Archives extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className='view index' id='archives'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Archives')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            <div className='module relative'>
              <div className='watermark'>
                <HighlightThisWeek />
              </div>
              <ReactMarkdown className='text' renderers={{ link: markdown_linkHelper }} source={t("Interactive tools, manuals, legends, and other content preserved by _The Archives_.\n\n_The Archives_ are where various, previously thought lost, repositories now reside. These repositories are containers to useful data and tools which originally coalesced during the height of humanity, commonly referred to as [_The Golden Age_](https://www.ishtar-collective.net/cards/the-golden-age).\n\nSometimes, not everything I build (or attempt to build for that matter) finds a home in the limelight of _Braytech's_ primary navigation, but still retains so much user value that it deserves a place to live. This is their space.\n\nPlease note, not everything here is guaranteed to work well, or at all. Some contents may even cause low-power devices to lock up under specific use coniditions i.e. the _Manifest_ tool.")} />
            </div>
            {/* <div className='module highlights'>
              <h3>{t('Eververse season overview')}</h3>
              <ReactMarkdown className='text' source={t("View details of the current season's weekly Eververse store stock")} />
              <Link className='button' to='/archives/eververse'>
                <div className='text'>{t('Go to')}</div>
              </Link>
              <h3>{manifest.DestinyInventoryItemDefinition[1115550924].displayProperties.name}</h3>
              <ReactMarkdown className='text' source={t('')} />
              <Link className='button' to='/compare/nightfalls'>
                <div className='text'>{t('Go to')}</div>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Archives);
