import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import Typography from '@mui/material/Typography';
import useDocumentTitle from '../../hooks/DocumentTitle';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAppSearch } from '../../contexts/SearchContext';

import { authConfig } from '../../config/authConfig';
import { useApi } from '../../hooks/Api';
import { useAuth0 } from '@auth0/auth0-react';

const noData = (
  <Alert key={0} severity={'info'}>
    No data found
  </Alert>
);

const Dashboard = () => {
  let keys: string[] = [];

  const { query } = useAppSearch();
  useDocumentTitle('App Dashboard');
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const opts = { query, ...authConfig };
  const { loading, error, data, refresh } = useApi(
    `${window.location.origin}/api/search`,
    opts
  );

  if (query.length === 0) return noData;

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error !== null) {
    if (error.error === 'login_required') {
      return (
        <Button variant={'contained'} onClick={() => loginWithRedirect(opts)}>
          Login
        </Button>
      );
    }
    if (error.error === 'consent_required') {
      return (
        <Button variant={'contained'} onClick={getTokenAndTryAgain}>
          Consent to reading users
        </Button>
      );
    }
    return <Alert severity="error">Oops... {error.message}</Alert>;
  }

  if (data) {
    keys = Object.keys(data);
  }

  const renderData = (keys: any, data: any) => {
    return keys.map((item: any, index: number) => {
      if (data[item]['results']) {
        return data[item]['results'].map((details: any, index: number) => {
          return (
            <Accordion key={index} TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {details?.title || 'N/A'}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {details?.description || 'N/A'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant={'body1'}>
                  Link: {details?.link || 'N/A'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        });
      } else {
        return noData;
      }
    });
  };

  return (
    <>
      {keys.length > 0 && renderData(keys, data)}
      {keys.length === 0 && noData}
    </>
  );
};

export default Dashboard;
