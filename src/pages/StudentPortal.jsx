import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  School,
  Assignment,
  EventNote,
  Timeline,
  Grade,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Wrap Material-UI components with motion
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const StudentPortal = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState({
    courses: [],
    attendance: [],
    assignments: [],
    grades: [],
    upcomingEvents: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/students/dashboard');
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const getAttendancePercentage = () => {
    if (!studentData.attendance.length) return 0;
    const present = studentData.attendance.filter(a => a.status === 'present').length;
    return (present / studentData.attendance.length) * 100;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 4,
            mb: 4,
            width: '100%',
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.name}!
                </Typography>
                <Typography variant="subtitle1">
                  Your student dashboard provides a comprehensive overview of your academic progress.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={`Student ID: ${user?.studentId || 'N/A'}`}
                    color="secondary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Grade: ${studentData?.grade || 'N/A'}`}
                    color="secondary"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Dashboard Content */}
      <Container maxWidth="xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={3}>
              <MotionPaper
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Attendance Overview
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Overall Attendance
                  </Typography>
                  <Box sx={{ position: 'relative', height: 20, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getAttendancePercentage()}
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4caf50',
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
                          backgroundSize: '1rem 1rem',
                          animation: 'progress-bar-stripes 1s linear infinite',
                        },
                        '@keyframes progress-bar-stripes': {
                          '0%': { backgroundPosition: '1rem 0' },
                          '100%': { backgroundPosition: '0 0' },
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {getAttendancePercentage().toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {getAttendancePercentage().toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Present Days
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        {(100 - getAttendancePercentage()).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Absent Days
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Attendance Status
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${studentData.attendance.filter(a => a.status === 'present').length} Present`}
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50',
                          '& .MuiChip-label': { fontWeight: 'bold' }
                        }}
                      />
                      <Chip
                        label={`${studentData.attendance.filter(a => a.status === 'absent').length} Absent`}
                        sx={{
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                          color: '#ff9800',
                          '& .MuiChip-label': { fontWeight: 'bold' }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </MotionPaper>
            </Grid>

            {/* Enrolled Courses */}
            <Grid item xs={12} md={5}>
              <MotionPaper
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Enrolled Courses
                </Typography>
                <List>
                  {studentData.courses.map((course, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <School />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={course.name}
                        secondary={`Teacher: ${course.teacher}`}
                      />
                      <Chip
                        label={course.status}
                        color={course.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </MotionPaper>
            </Grid>

            {/* Upcoming Events */}
            <Grid item xs={12} md={4}>
              <MotionPaper
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                <List>
                  {studentData.upcomingEvents.map((event, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                          <EventNote />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={event.date}
                      />
                    </ListItem>
                  ))}
                </List>
              </MotionPaper>
            </Grid>

            {/* Recent Assignments */}
            <Grid item xs={12}>
              <MotionPaper
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Recent Assignments
                </Typography>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Grid container spacing={2}>
                    {studentData.assignments.map((assignment, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <MotionCard
                          variants={itemVariants}
                          variant="outlined"
                          sx={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <Assignment />
                              </Avatar>
                            }
                            title={assignment.title}
                            subheader={`Due: ${assignment.dueDate}`}
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              {assignment.description}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Chip
                                label={assignment.status}
                                color={
                                  assignment.status === 'completed'
                                    ? 'success'
                                    : assignment.status === 'pending'
                                    ? 'warning'
                                    : 'error'
                                }
                                size="small"
                              />
                            </Box>
                          </CardContent>
                        </MotionCard>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </MotionPaper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentPortal;
