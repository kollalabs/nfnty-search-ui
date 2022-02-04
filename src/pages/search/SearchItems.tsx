import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import React from 'react';
import Typography from '@mui/material/Typography';

import { Connection, ConnectionDetails, ConnectionMeta } from '../../models/DataModels';
import { handleExternal } from '../../utils/Events';

const SearchItems = (keys: string[], data: any) => {
  let header: any[] = [];
  let body: any[] = [];

  return keys.map((item: string, index: number) => {
    header = [];
    body = [];

    if (item === 'subscriber') {
      return;
    }

    const details: Connection = data[item];
    const meta: ConnectionMeta = details.meta as ConnectionMeta;
    const results: ConnectionDetails[] = details.results || ([] as ConnectionDetails[]);

    if (meta) {
      header.push(
        <Container disableGutters key={index} sx={{ py: 2 }}>
          <Badge
            badgeContent={results.length}
            color={'success'}
            sx={{
              display: 'inline-block',
              mr: 2,
            }}
          >
            <img src={meta.logo} alt={'Connection Logo'} style={{ maxWidth: '50px' }} />
          </Badge>
          <Typography variant={'h6'} sx={{ display: 'inline-block' }}>
            {meta.display_name} Results:
          </Typography>
        </Container>
      );
    }

    if (results && results.length) {
      body = results.map((details: ConnectionDetails, index: number) => {
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
              <Link href="#" onClick={() => handleExternal(details?.link)}>
                {details?.link || 'N/A'}
              </Link>
            </AccordionDetails>
          </Accordion>
        );
      });
    } else {
      return <Alert severity="info">No Results</Alert>;
    }
    return [header, body];
  });
};

export { SearchItems };
