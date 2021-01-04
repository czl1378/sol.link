import React, { Suspense } from 'react';

import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { CurrAccount } from './components';

import Main from './views/Main/';
import Home from './views/Home/';
import Aggregator from './views/Aggregator/';
import Token from './views/Token';

function Root(): React.ReactElement {
  return (
    <Suspense fallback='...'>
      <CurrAccount>
        <Router>
          <Routes>
            <Route path='/' element={<Main />}>
              <Route path='' element={<Navigate to='home' />} />
              <Route path='home' element={<Home />} />
              <Route path='aggregator/:pubkey' element={<Aggregator />} />
            </Route>
          </Routes>
        </Router>
      </CurrAccount>
    </Suspense>
  );
}

export default React.memo(Root);