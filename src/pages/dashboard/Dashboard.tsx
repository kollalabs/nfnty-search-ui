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

import { authConfig } from '../../config/authConfig';
import { useApi } from '../../hooks/Api';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  let keys: string[] = [];
  const opts = { ...authConfig };

  useDocumentTitle('App Dashboard');

  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const { loading, error, data, refresh } = useApi(
    `${window.location.origin}/api/search`,
    opts
  );

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
        // @ts-ignore
        return data[item]['results'].map((details: any, index: number) => {
          console.log('details:', details);
          return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant={'body1'}>{details.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant={'body1'}>{details.description}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        });
      } else {
        return (
          <Alert key={index} severity={'info'}>
            No data found
          </Alert>
        );
      }
    });
  };

  return (
    <>
      {keys.length > 0 && renderData(keys, data)}
      {keys.length === 0 && <Alert severity={'info'}>No data found</Alert>}
    </>
  );
};

export default Dashboard;
