import React, { createContext, useState } from 'react';
import { AuthProps, Token } from '../models/AuthModels';

const UserContext = createContext<Token>(null as Token);
const UserDispatchContext = createContext<
  React.Dispatch<React.SetStateAction<string | null>>
>(() => {});

function UserProvider(props: AuthProps) {
  const [token, setToken] = useState(props.token || null);

  return (
    <UserContext.Provider value={token}>
      <UserDispatchContext.Provider value={setToken}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export { UserContext, UserDispatchContext, UserProvider };
