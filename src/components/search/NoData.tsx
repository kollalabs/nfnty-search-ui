import React from 'react';
import { Alert } from '@mui/material';

const NoData = (
  <>
    <Alert key={0} severity={'info'}>
      No data found
    </Alert>
    <h3>Add more connections</h3>
  </>
);
const PreSearch = <></>;
export { NoData, PreSearch };
