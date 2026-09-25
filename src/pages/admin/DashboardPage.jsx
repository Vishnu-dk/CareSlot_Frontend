import { useMemo } from "react";
import {
  Box, Flex, Grid, Heading, HStack, Text, VStack, Spinner, Alert, AlertIcon,
} from "@chakra-ui/react";
import { TrendingUp, Users, CalendarCheck, Activity } from "lucide-react";
import {
  useGetAllCliniciansQuery,
  useGetAllPatientsQuery,
  useGetAllAppointmentsQuery,
} from "../../features/api/careSlotApi";
import { fmtDate } from "../../utils/dates";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function AdminDashboard() {
  const { data: clinicians = [], isLoading: loadClin } = useGetAllCliniciansQuery();
  const { data: patients = [], isLoading: loadPat } = useGetAllPatientsQuery();
  const { data: appointments = [], isLoading: loadAppt } = useGetAllAppointmentsQuery();

  const isLoading = loadClin || loadPat || loadAppt;

  const stats = useMemo(() => {
    const totalAppts = appointments.length;
    const completedAppts = appointments.filter(a => a.status === "COMPLETED").length;
    const bookedAppts = appointments.filter(a => a.status === "BOOKED").length;
    
    const completionRate = totalAppts > 0 
      ? ((completedAppts / totalAppts) * 100).toFixed(1) 
      : 0;

    return [
      { label: "Total Patients", value: patients.length, icon: Users, color: "#A07855" },
      { label: "Active Clinicians", value: clinicians.length, icon: Activity, color: "#1d4ed8" },
      { label: "Booked Appointments", value: bookedAppts, icon: CalendarCheck, color: "#15803d" },
      { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, color: "#dc2626" },
    ];
  }, [clinicians, patients, appointments]);

  const recentActivity = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))
      .slice(0, 5)
      .map(appt => ({
        action: appt.status === "COMPLETED" ? "Appointment Completed" : "New Appointment Booked",
        detail: `${appt.patientName || 'Patient'} with ${appt.clinicianName || 'Dr.'}`,
        time: fmtDate(appt.startsAt.slice(0, 10)),
        status: appt.status,
      }));
  }, [appointments]);



  return (
    <Box  mx="auto" py={4}>
      
      {/* Header */}
      <VStack align="start" spacing={1} mb={7}>
        <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
          System Overview
        </Text>
        <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
          Admin Dashboard
        </Heading>
      </VStack>

      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} mb={5}>
        {stats.map(stat => (
          <Box key={stat.label} bg="beige" borderRadius="20px" p={5} boxShadow={CARD_SHADOW}>
            <Flex justify="space-between" align="flex-start">
              <Box>
                <Text fontSize={{base: "8px", md: "11.5px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
                  {stat.label}
                </Text>
                <Text fontSize={{base: "20px", md: "30px"}} fontWeight={800} color="espresso" mt={2}>
                  {stat.value}
                </Text>
              </Box>
<Box 
  display="flex"
  alignItems="center"
  justifyContent="center"
  boxSize={{ base: "25px", md: "48px", lg: "56px" }} 
  p={{ base: 1, md: 2 }} 
  bg="white" 
  borderRadius="full" 
  shadow="sm"
> 
  <stat.icon 
    color={stat.color} 
  /> 
</Box>

            </Flex>
          </Box>
        ))}
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={5} mb={5}>
        
        <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW}>
          <Text fontSize={{base: "16px", md: "18px"}} fontWeight={700} color="espresso" mb={5}>
            Latest Activity Log
          </Text>
          
          <VStack spacing={0} align="stretch">
            {recentActivity.length === 0 ? (
              <Text color="#5D4037" textAlign="center" fontSize={{base: "12px", md: "16px"}} py={8}>No recent activity.</Text>
            ) : (
              recentActivity.map((item, i) => (
                <Flex 
                  key={i} 
                  align="center" 
                  gap={4} 
                  py={3} 
                  borderBottomWidth={i < recentActivity.length - 1 ? "1px" : "none"} 
                  borderColor="rgba(215,204,200,0.5)"
                >
                  <Box w="8px" h="8px" borderRadius="full" bg={item.status === 'COMPLETED' ? '#15803d' : '#A07855'} flexShrink={0} />
                  <Box flex={1}>
                    <Text fontWeight={600} fontSize={{base: "12px", md: "13.5px"}} color="espresso">{item.action}</Text>
                    <Text fontSize={{base:"10px",md:"12.5px"}} color="#5D4037">{item.detail}</Text>
                  </Box>
                  <Text fontSize={{base: "10px", md: "12px"}} color="#5D4037" whiteSpace="nowrap">{item.time}</Text>
                </Flex>
              ))
            )}
          </VStack>
        </Box>

        <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW}>
          <Text fontSize={{base: "16px", md: "18px"}} fontWeight={700} color="espresso" mb={5}>
            User Distribution
          </Text>
          
          <VStack spacing={6} align="stretch">
            <Box>
              <Flex justify="space-between" fontSize={{base:"10px",md:"12.5px"}} mb={2}>
                <Text fontWeight={500} color="espresso">Patients</Text>
                <Text fontWeight={700} color="brand.500">{patients.length}</Text>
              </Flex>
              <Box h={{base: "6px", md: "8px"}} borderRadius="full" bg="taupe" overflow="hidden">
                <Box 
                  h="100%" 
                  w={`${Math.min((patients.length / (patients.length + clinicians.length || 1)) * 100, 100)}%`} 
                  bg="brand.500" 
                  borderRadius="full" 
                />
              </Box>
            </Box>

            <Box>
              <Flex justify="space-between" fontSize={{base:"10px",md:"12.5px"}} mb={2}>
                <Text fontWeight={500} color="espresso">Clinicians</Text>
                <Text fontWeight={700} color="#1d4ed8">{clinicians.length}</Text>
              </Flex>
              <Box h={{base: "6px", md: "8px"}} borderRadius="full" bg="taupe" overflow="hidden">
                <Box 
                  h="100%" 
                  w={`${Math.min((clinicians.length / (patients.length + clinicians.length || 1)) * 100, 100)}%`} 
                  bg="#1d4ed8" 
                  borderRadius="full" 
                />
              </Box>
            </Box>

            <Box borderTopWidth="1px" borderColor="taupe" pt={4} mt={2}>
              <Text fontSize={{base: "10px", md: "12px"}} color="#5D4037" mb={1}>System Health</Text>
              <HStack spacing={2}>
                <Box w="10px" h="10px" borderRadius="full" bg="#15803d" />
                <Text fontSize={{base: "12px", md: "14px"}} fontWeight={700} color="espresso">Operational</Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Grid>

    </Box>
  );
}