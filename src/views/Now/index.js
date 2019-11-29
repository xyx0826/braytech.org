import React from 'react';
import cx from 'classnames';

import View from './View';
import Settings from './Settings';

import './styles.css';

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {

    const views = {
      'default': {
        'name': '',
        'component': View
      },
      'settings': {
        'name': 'settings',
        'component': Settings
      }
    };
    
    const view = this.props.match.params.view && views[this.props.match.params.view] && this.props.match.params.view || 'default';

    let ViewComponent = views[view].component;

    return (
      <div className={cx('view', views[view].name)} id='now'>
        <ViewComponent {...this.props} />
      </div>
    )
  }
}

export default Now;
