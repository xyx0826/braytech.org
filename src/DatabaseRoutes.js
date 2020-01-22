import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/UI/Header';
import PostmasterCapacity from './components/Notifications/PostmasterCapacity';

import Database from './views/Database';
import Eververse from './views/Database/Eververse';
import Manifest from './views/Database/Manifest';
import LastWish from './views/Database/LastWish';
import ChaliceRecipes from './views/Database/ChaliceRecipes';
import ChaliceRecipesDebug from './views/Database/ChaliceRecipes/Debug';

class DatabaseRoutes extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <>
        <PostmasterCapacity />
        <Route path='/' render={route => <Header route={route} {...this.state} {...this.props} />} />
        <Switch>
          <Route path={`${match.url}/eververse`} component={Eververse} />
          <Route path={`${match.url}/manifest`} component={Manifest} />
          <Route path={`${match.url}/last-wish`} component={LastWish} />
          <Route path={`${match.url}/chalice-of-opulence/debug`} exact component={ChaliceRecipesDebug} />
          <Route path={`${match.url}/chalice-of-opulence/:rune1?/:rune2?/:rune3?`} component={ChaliceRecipes} />
          <Route path={`${match.url}`} component={Database} />
        </Switch>
      </>
    );
  }
}

export default DatabaseRoutes;
