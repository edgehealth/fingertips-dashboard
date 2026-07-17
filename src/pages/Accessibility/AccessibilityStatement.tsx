import React from 'react';
import { Box, Container, Link as MuiLink, List, ListItem, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../../theme';

/**
 * Accessibility statement for the Fingertips Dashboard.
 *
 * Loosely follows the GOV.UK model accessibility statement structure, trimmed to
 * the sections relevant to this service (intro, known issues, contact, and
 * planned improvements).
 */

// Contact mailbox — confirm this is monitored before publishing.
const CONTACT_EMAIL = 'info@edgehealth.co.uk';

const AccessibilityStatement: React.FC = () => {
  React.useEffect(() => {
    const previous = document.title;
    document.title = 'Accessibility statement | Fingertips Dashboard';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <Box
      component="main"
      id="main-content"
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.secondary.lightPink,
        py: { xs: 3, md: 6 },
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <MuiLink component={RouterLink} to="/cyp" sx={{ color: colors.primary.darkBlue, fontWeight: 600 }}>
            &larr; Back to the dashboard
          </MuiLink>
        </Box>

        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '0px 24px 0px 24px',
            border: `2px solid ${colors.primary.darkBlue}`,
            p: { xs: 3, md: 5 },
            color: colors.text.primary,
            '& h2': { mt: 4, mb: 1.5, fontSize: '1.4rem', fontWeight: 700 },
            '& h3': { mt: 3, mb: 1, fontSize: '1.1rem', fontWeight: 700 },
            '& p': { mb: 1.5, lineHeight: 1.6 },
            '& a': { color: colors.secondary.purple },
          }}
        >
          <Typography component="h1" sx={{ fontSize: '2rem', fontWeight: 700, mb: 2 }}>
            Accessibility statement for the Fingertips Dashboard
          </Typography>

          <Typography>
            This statement applies to the Fingertips Dashboard, an interactive tool that visualises NHS
            Fingertips health metrics across Integrated Care Boards (ICBs) in England.
          </Typography>
          <Typography>
            This service is run by Edge Health. We want as many people as possible to be able to use it.
            For example, that means you should be able to:
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4, mb: 2 }}>
            <ListItem sx={{ display: 'list-item', px: 0 }}>navigate the dashboard and select regions using a keyboard;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>read region names and values with a screen reader;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>zoom in up to 300% without the text spilling off the screen;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>use most of the service without relying on colour alone to understand it.</ListItem>
          </List>
          <Typography>
            <MuiLink href="https://mcmw.abilitynet.org.uk/" target="_blank" rel="noopener noreferrer">
              AbilityNet
            </MuiLink>{' '}
            has advice on making your device easier to use if you have a disability.
          </Typography>

          <Typography component="h2">How accessible this website is</Typography>
          <Typography>
            We know some parts of this website are not fully accessible. The following content may cause
            difficulties for some users:
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4, mb: 2 }}>
            <ListItem sx={{ display: 'list-item', px: 0 }}>
              The map and line chart convey trends visually. Region names and values are available to
              screen readers, and a text summary is provided for the chart, but there is not yet a full
              downloadable data table equivalent for all values.
            </ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>
              The map uses a colour scale to show relative values; the underlying numbers are announced
              individually but the overall pattern is presented visually.
            </ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>
              Some chart animations and hover effects do not yet respond to the browser&rsquo;s
              &ldquo;reduced motion&rdquo; setting.
            </ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>
              The service has not yet been fully tested with a range of assistive technologies
              (for example NVDA, JAWS and VoiceOver).
            </ListItem>
          </List>

          <Typography component="h2">Feedback and contact information</Typography>
          <Typography>
            If you need information on this service in a different format, or you find an accessibility
            problem not listed on this page, please contact us:
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4, mb: 2 }}>
            <ListItem sx={{ display: 'list-item', px: 0 }}>
              email:{' '}
              <MuiLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</MuiLink>
            </ListItem>
          </List>
          <Typography>We&rsquo;ll consider your request and aim to get back to you within 5 working days.</Typography>

          <Typography component="h2">What we&rsquo;re doing to improve accessibility</Typography>
          <Typography>We are actively working to improve the accessibility of this service. Planned work includes:</Typography>
          <List sx={{ listStyleType: 'disc', pl: 4, mb: 2 }}>
            <ListItem sx={{ display: 'list-item', px: 0 }}>adding a &ldquo;view data as a table&rdquo; option for the map and charts;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>running automated (axe/Lighthouse) and manual assistive-technology testing, and publishing the results;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>completing a full colour-contrast review;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>honouring reduced-motion preferences;</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0 }}>re-baselining the service against WCAG 2.2 AA.</ListItem>
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default AccessibilityStatement;
