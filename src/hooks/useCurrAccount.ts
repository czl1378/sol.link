// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';

import { CurrAccountContext } from '../components';

export default function useAccount () {
  return useContext(CurrAccountContext);
}
