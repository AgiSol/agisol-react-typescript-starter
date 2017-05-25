
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Store, createStore, compose, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import createHistory from 'history/createHashHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';


import { IAppState, App, rootReducer } from './main';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './muiTheme';


// needed for onTouchTap http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

interface IHotModule {
  hot?: { accept: (path: string, callback: () => void) => void };
}

declare const require: (name: String) => any;
declare const module: IHotModule;

const history = createHistory();

function configureStore(): Store<IAppState> {

  const routingMiddleware = routerMiddleware(history);
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancers = composeEnhancers(applyMiddleware(routingMiddleware));

  const store: Store<IAppState> = createStore<IAppState>(rootReducer, enhancers);

  if (module.hot) {
    module.hot.accept('./main/Module', () => {
      const nextRootReducer: any = require('./main/Module').rootReducer;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store: Store<IAppState> = configureStore();


ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <ConnectedRouter history={history}>
            <App/>
          </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('app'),
);
