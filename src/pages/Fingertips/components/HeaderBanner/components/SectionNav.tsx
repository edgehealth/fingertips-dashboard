import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { sectionList, SectionId } from '../../../../../config/sections';
import { typography } from '../../../../../theme';

interface SectionNavProps {
  activeSectionId: SectionId;
}

const SectionNav: React.FC<SectionNavProps> = ({ activeSectionId }) => {
  return (
    <Box
      component="nav"
      aria-label="Dashboard sections"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      {sectionList.map((section) => {
        const isActive = section.id === activeSectionId;
        return (
          <Link
            key={section.id}
            to={section.path}
            aria-current={isActive ? 'page' : undefined}
            style={{ textDecoration: 'none' }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontFamily: typography.fonts.body,
                fontSize: '13px',
                fontWeight: isActive
                  ? typography.fontWeights.semibold
                  : typography.fontWeights.medium,
                color: isActive ? section.accentColor : 'rgba(255, 255, 255, 0.6)',
                backgroundColor: isActive
                  ? `rgba(${section.accentColorRgb}, 0.25)`
                  : 'rgba(255, 255, 255, 0.1)',
                border: isActive
                  ? `1px solid rgba(${section.accentColorRgb}, 0.6)`
                  : '1px solid transparent',
                transition: 'background-color 150ms ease',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: isActive
                    ? `rgba(${section.accentColorRgb}, 0.3)`
                    : 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {section.navLabel}
            </Box>
          </Link>
        );
      })}
    </Box>
  );
};

export default SectionNav;
