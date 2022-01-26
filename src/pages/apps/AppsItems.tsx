import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

const AppItems = (keys: any, data: any) => {
  return keys.map((item: any) => {
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
              Link:
              <Typography variant={'body1'} sx={{ fontFamily: 'Monospace' }}>
                {details?.link || 'N/A'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      });
    }
  });
};

export { AppItems };
