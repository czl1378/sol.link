import React, { useState } from 'react';

export const CurrAccountContext = React.createContext<any>(undefined);

const CurrAccountProvider = ({ 
  children
}: {
  children?: any
}) => {
  const [account, setAccount] = useState();

  return (
    <CurrAccountContext.Provider value={{ account, setAccount }}>
      { children }
    </CurrAccountContext.Provider>
  );
}

export default CurrAccountProvider;