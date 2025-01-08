import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const steps = ['Personal Information', 'Academic Details', 'Documents Upload'];

const Enroll = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    previousSchool: '',
    gradeApplying: '',
    documents: {
      birthCertificate: null,
      previousRecords: null,
      photo: null,
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setActiveStep(steps.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Previous School"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Grade Applying For</InputLabel>
                <Select
                  name="gradeApplying"
                  value={formData.gradeApplying}
                  onChange={handleInputChange}
                  label="Grade Applying For"
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      Grade {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Information"
                name="additionalInfo"
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Required Documents
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    Upload Birth Certificate
                    <input type="file" hidden />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    Upload Previous School Records
                    <input type="file" hidden />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    Upload Recent Photo
                    <input type="file" hidden />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Student Enrollment
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Join Triton Academy and begin your journey to excellence
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Thank you for your application! We will contact you soon.
            </Alert>
            <Typography paragraph>
              Your enrollment application has been successfully submitted.
              Our admissions team will review your application and contact you within 2-3 business days.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setActiveStep(0)}
            >
              Submit Another Application
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Enroll;
