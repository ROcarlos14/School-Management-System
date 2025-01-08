import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Email,
  LinkedIn,
  School,
  Stars,
} from '@mui/icons-material';

const teachers = [
  {
    id: 1,
    name: 'Dr. Robert Smith',
    image: 'https://source.unsplash.com/random/400x400/?professor,man',
    position: 'Head of Mathematics Department',
    qualifications: 'Ph.D. in Mathematics, Stanford University',
    experience: '15+ years',
    subjects: ['Advanced Mathematics', 'Calculus', 'Statistics'],
    awards: ['Teacher of the Year 2024', 'Excellence in Education Award'],
    email: 'r.smith@tritonacademy.edu',
    linkedin: '#',
  },
  {
    id: 2,
    name: 'Prof. Lisa Chen',
    image: 'https://source.unsplash.com/random/400x400/?professor,woman',
    position: 'Science Department Chair',
    qualifications: 'Ph.D. in Physics, MIT',
    experience: '12+ years',
    subjects: ['Physics', 'Chemistry', 'Environmental Science'],
    awards: ['Innovation in Teaching Award', 'Research Excellence'],
    email: 'l.chen@tritonacademy.edu',
    linkedin: '#',
  },
  // Add more teachers as needed
];

const staff = [
  {
    id: 1,
    name: 'Ms. Jennifer Parker',
    image: 'https://source.unsplash.com/random/400x400/?counselor,woman',
    position: 'Student Counselor',
    qualifications: 'M.A. in Psychology',
    experience: '8+ years',
    specialization: 'Academic and Career Counseling',
    email: 'j.parker@tritonacademy.edu',
    linkedin: '#',
  },
  // Add more staff members
];

const TeachersAndStaff = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTeacherCard = (teacher) => (
    <Grid item xs={12} md={4} key={teacher.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={teacher.image}
          alt={teacher.name}
          sx={{
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom component="div">
            {teacher.name}
          </Typography>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {teacher.position}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <School sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {teacher.qualifications}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Experience: {teacher.experience}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Subjects:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {teacher.subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          {teacher.awards && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Stars sx={{ mr: 1, color: 'primary.main' }} />
                Awards:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {teacher.awards.join(', ')}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Tooltip title="Email">
              <IconButton href={`mailto:${teacher.email}`} color="primary">
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn Profile">
              <IconButton href={teacher.linkedin} target="_blank" color="primary">
                <LinkedIn />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderStaffCard = (staffMember) => (
    <Grid item xs={12} md={4} key={staffMember.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="300"
          image={staffMember.image}
          alt={staffMember.name}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom component="div">
            {staffMember.name}
          </Typography>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {staffMember.position}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {staffMember.qualifications}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Experience: {staffMember.experience}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Specialization: {staffMember.specialization}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Tooltip title="Email">
              <IconButton href={`mailto:${staffMember.email}`} color="primary">
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn Profile">
              <IconButton href={staffMember.linkedin} target="_blank" color="primary">
                <LinkedIn />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Our Teachers & Staff
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Meet our dedicated team of educators and support staff
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Teachers" />
          <Tab label="Support Staff" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <Grid container spacing={4}>
            {teachers.map(renderTeacherCard)}
          </Grid>
        )}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <Grid container spacing={4}>
            {staff.map(renderStaffCard)}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default TeachersAndStaff;
