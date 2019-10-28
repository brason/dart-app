import React, { useState } from 'react';

export const Context = React.createContext(null);

export default function State({ children }: any) {
  return <Context.Provider value={null}>{children}</Context.Provider>;
}
