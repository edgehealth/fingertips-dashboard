import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DashboardInfoTooltip: React.FC = () => {
  return (
    <Tooltip 
      title={
        <Box sx={{ p: 1 }}>
          <Box sx={{ mb: 1.5 }}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '13px', display: 'block', mb: 0.5 }}>
              About this dashboard
            </Box>
            <Box component="span" sx={{ fontSize: '12px', display: 'block', lineHeight: 1.5 }}>
              This interactive map visualizes health metrics across Integrated Care Boards (ICBs) in England.
            </Box>
          </Box>
          
          <Box sx={{ mb: 1.5 }}>
            <Box component="span" sx={{ fontSize: '12px', display: 'block', lineHeight: 1.5 }}>
              With the map on the left, click on any region to view detailed ICB-level values and compare against the England average. The color scale indicates performance relative to other ICBs for the selected metric.
              Using the controls on the right, you can select different metrics and years to explore various aspects of public women's and children's health data over time.
            </Box>
          </Box>
          
          <Box>
            <Box component="span" sx={{ fontWeight: 600, fontSize: '13px', display: 'block', mb: 0.5 }}>
              Data Source
            </Box>
            <Box component="span" sx={{ fontSize: '12px', display: 'block', lineHeight: 1.5 }}>
              Public Health England Fingertips API
            </Box>
          </Box>
        </Box>
      }
      arrow
      placement="bottom-start"
    >
      <IconButton
        size="small"
        aria-label="About this dashboard"
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: '20px' }} />
      </IconButton>
    </Tooltip>
  );
};

export default DashboardInfoTooltip;