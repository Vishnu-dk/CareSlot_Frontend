import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, HStack, Flex } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react"; // Assuming you have lucide-react installed
import Toast, { useToastMsg } from "../../components/common/Toast";
import { useUpdateClinicianProfileMutation, useUpdatePatientProfileMutation } from "../../features/api/careslotApi";
import { selectCurrentUserRole, logout } from "../../features/auth/authSlice"; // Import logout action
import TopBar from "../../components/layout/TopBar";

export default function ProfileSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserRole);
  const { message, show } = useToastMsg();
  
  const [updatePatient] = useUpdatePatientProfileMutation();
  const [updateClinician] = useUpdateClinicianProfileMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    specialty: "",
    licenseNumber: "",
  });

  const handleBack = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userType === 'PATIENT') {
        await updatePatient({ 
          firstName: formData.firstName, 
          lastName: formData.lastName, 
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.phoneNumber 
        }).unwrap();
      } else {
        await updateClinician({ 
          firstName: formData.firstName, 
          lastName: formData.lastName, 
          specialty: formData.specialty,
          licenseNumber: formData.licenseNumber 
        }).unwrap();
      }
      
      show("Profile updated successfully!");
      // Navigate based on role after successful setup
      navigate(userType === 'CLINICIAN' ? "/clinician" : "/patient"); 
    } catch (err) {
      show(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Box bg="beige" minH="100vh" px={{ base: 2, md: 5 }} py={2}>
      <TopBar title="Profile Setup" />
      
      <Box maxW="500px" mx="auto" mt={10} p={6} bg="white" borderRadius="20px" boxShadow="lg">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="espresso">Complete Your Profile</Heading>
          <Button 
            variant="ghost" 
            leftIcon={<ArrowLeft size={16} />} 
            onClick={handleBack}
            fontSize="sm"
            color="#5D4037"
          >
            Back
          </Button>
        </Flex>

        <Text mb={6} color="#5D4037">Please fill in the details below to access your dashboard.</Text>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <HStack width="full">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </FormControl>
            </HStack>

            {userType === 'CLINICIAN' ? (
              <>
                <FormControl isRequired>
                  <FormLabel>Specialty</FormLabel>
                  <Input placeholder="e.g. Diagnostics" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>License Number</FormLabel>
                  <Input placeholder="e.g. MD-12345" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="tel" placeholder="" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                </FormControl>
              </>
            )}

            <Button type="submit" colorScheme="brand" width="full" isLoading={false}>
              Save & Continue
            </Button>
          </VStack>
        </form>
        <Toast message={message} />
      </Box>
    </Box>
  );
}