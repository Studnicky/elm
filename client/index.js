import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

//  Import directories
import App from './modules/app';

render(
  <AppContainer>
    <Default />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./modules/app', () => {
    render(
      <AppContainer>
        <Default />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
