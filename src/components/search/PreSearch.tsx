import React from 'react';
import Typography from '@mui/material/Typography';
import { AnyObject } from '../../models/CommonModels';

const PreSearch = ({ message }: AnyObject) => {
  return <Typography variant={'body1'}>{message}</Typography>;
};

export default PreSearch;
