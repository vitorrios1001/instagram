import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Feed from './pages/Feed';
import New from './pages/New';

const Routes = () => (
    <Switch>
        <Route path="/" exact component={Feed} />
        <Route path="/new" component={New} />
    </Switch>
)

export default Routes;