import React from 'react';
import { Box } from '@mui/material';
import Logo from './components/Logo';
import TitleText from './components/TitleText';
import DashboardInfoTooltip from './components/DashboardInfoTooltip';
import SectionNav from './components/SectionNav';
import { colors } from '../../../../theme';
import { SectionConfig } from '../../../../config/sections';

interface HeaderContainerProps {
  section: SectionConfig;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ section }) => {
  return (
    <Box
      sx={{
        padding: '0.5rem',
        backgroundColor: colors.primary.darkBlue,
        borderTopRightRadius: '24px',
        borderBottomLeftRadius: '24px',
        borderTopLeftRadius: '0',
        borderBottomRightRadius: '0',
        boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Logo />
        <TitleText
          mainTitle={section.mainTitle}
          subtitle={section.subtitle}
          workInProgress={section.id === 'early-cancer'}
        />
        <SectionNav activeSectionId={section.id} />
        <DashboardInfoTooltip />
      </Box>
    </Box>
  );
};

export default HeaderContainer;