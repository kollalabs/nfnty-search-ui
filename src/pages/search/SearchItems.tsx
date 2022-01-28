import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const SearchItems = (keys: any, data: any) => {
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
              <TextField
                sx={{ fontFamily: 'Monospace' }}
                aria-readonly
                disabled
                fullWidth={true}
                id="outlined-basic"
                label="Search"
                variant={'filled'}
                value={details?.link || 'N/A'}
              />
            </AccordionDetails>
          </Accordion>
        );
      });
    }
  });
};

export { SearchItems };
