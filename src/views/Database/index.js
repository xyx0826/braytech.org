import React from 'react';
import { NavLink } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import './styles.css';

import Manifest from './Manifest';
import Eververse from './Eververse';
import LastWish from './LastWish';

class Database extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t, viewport, match } = this.props;
    const view = match.params?.view || 'last-wish';

    const views = {
      manifest: {
        name: 'manifest',
        component: Manifest
      },
      eververse: {
        name: 'eververse',
        component: Eververse
      },
      'last-wish': {
        name: 'last-wish',
        component: LastWish
      }
    };

    const View = views[view]?.component || views.manifest.component;

    const nav = (
      <div className='module views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon' />
            <NavLink to='/database' exact />
          </li>
          <li className='linked'>
            <div className='icon manifest' />
            <NavLink to='/database/manifest' exact />
          </li>
          <li className='linked'>
            <div className='icon eververse' />
            <NavLink to='/database/eververse' exact />
          </li>
        </ul>
      </div>
    );

    return (
      <div className={cx('view', views[view].name)} id='database'>
        <View nav={nav} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Database);
