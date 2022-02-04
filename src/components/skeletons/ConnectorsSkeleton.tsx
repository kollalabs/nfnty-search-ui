import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { centerItAll } from '../../styles/coreStyles';

function ConnectorSkeleton() {
  return (
    <>
      <Skeleton
        animation="wave"
        variant={'rectangular'}
        height={200}
        width={200}
        sx={[centerItAll, { borderRadius: '16px', mr: 2 }]}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={80}
          height={80}
          style={{ visibility: 'visible' }}
        />
      </Skeleton>
    </>
  );
}

export default ConnectorSkeleton;
