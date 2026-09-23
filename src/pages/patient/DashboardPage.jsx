import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  useGetMyAppointmentsQuery, 
  useGetMyCarePlansQuery, 
  useCancelAppointmentMutation,
} from "../../features/api/careSlotApi";
import ProgressRing from "../../components/common/ProgressRing";
import StatusBadge from "../../components/common/StatusBadge";
import Toast, { useToastMsg } from "../../components/common/Toast";
import { fmtDate, fmtTime } from "../../utils/dates";

import { Box, Button, Flex, Grid, Heading, HStack, Text, useBreakpointValue, VStack } from "@chakra-ui/react";

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  
  const { data: appointments = [] } = useGetMyAppointmentsQuery();
  const { data: carePlans = [] } = useGetMyCarePlansQuery();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const { message, show } = useToastMsg();

  const upcoming = appointments.filter((a) => a.status === "BOOKED");
  const completed = appointments.filter((a) => a.status === "COMPLETED");
  const next = upcoming[0];
  const activePlan = carePlans.find((p) => p.status === "ACTIVE");
  const progress = activePlan ? Math.round(Number(activePlan.progressPercentage)) : 0;
  const doneTasks = activePlan ? activePlan.tasks.filter((t) => t.status === "COMPLETED").length : 0;
  const cliniciansSeen = new Set(appointments.map((a) => a.clinicianId)).size;
  const name = (user?.email || "there").split("@")[0];

  const ringSize = useBreakpointValue({ base: 90, md: 120, lg: 160 });

  const handleCancel = async () => {
    try {
      await cancelAppointment(next.id).unwrap();
      show("Appointment cancelled");
    } catch (e) {
      show(e?.data?.message || "Could not cancel appointment");
    }
  };

  return (
    <Box  mx="auto" py={4}>
      
      <VStack align="start" spacing={1} mb={7}>
        <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
          Good morning
        </Text>
        <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
          {name} 👋
        </Heading>
        <Text fontSize={{base: "12px", md: "14px"}} color="#5D4037">
          Here's what's happening with your health today.
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={4}>
        
        {/* Upcoming Appointment Card */}
        <Box bg="beige" borderRadius="20px" p={6} boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)">
          <Flex justify="space-between" align="flex-start" mb={{md:4,base:1}}>
            <Text fontSize={{base: "10px", md: "11.5px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
              Upcoming Appointment
            </Text>
            {next && <StatusBadge status={next.status} />}
          </Flex>

          {next ? (
            <>
              <Text fontSize={{base: "13px", md: "18px"}} fontWeight={700} color="espresso" mb={1}>
                {next.reason || "General consultation"}
              </Text>
              <Text fontSize={{base: "10px", md: "14px"}} color="#5D4037">
                {next.clinicianName}
              </Text>
              <Text fontSize={{base: "10px", md: "13px"}} color="#5D4037" mb={{md:4,base:1}}>
                {fmtDate(next.startsAt.slice(0, 10))} · {fmtTime(next.startsAt.slice(11, 16))}
              </Text>
              
              <HStack spacing={3}>
                <Button
                  size="sm"
                  fontSize={{base: "10px", md: "14px"}}
                  variant="primary"
                  onClick={() => navigate("/patient/appointments")}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  bg="transparent"
                  border="1.5px solid"
                  borderColor="#dc2626"
                  color="#dc2626"
                  borderRadius="full"
                  fontWeight={600}
                  fontSize={{base: "10px", md: "14px"}}
                  px={4}
                  onClick={handleCancel}
                  _hover={{ bg: "rgba(220, 38, 38, 0.06)" }}
                >
                  Cancel
                </Button>
              </HStack>
            </>
          ) : (
            <Text fontSize={{base: "12px", md: "14px"}} color="#5D4037" py={3}>
              Nothing scheduled.{" "}
              <Text
                as="span"
                color="brand.500"
                fontWeight={600}
                cursor="pointer"
                onClick={() => navigate("/patient/book")}
                _hover={{ textDecoration: "underline" }}
              >
                Book a visit →
              </Text>
            </Text>
          )}
        </Box>

        {/* Active Care Plan Card */}
        <Box 
          bg="beige" 
          borderRadius="20px" 
          p={6} 
          boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
          display="flex" 
          alignItems="center" 
          gap={5}
        >
          <Box position="relative" flexShrink={0}>
            <ProgressRing value={progress} size={ringSize} />
            <Flex
              position="absolute"
              inset={0}
              direction="column"
              align="center"
              justify="center"
            >
              <Text fontSize={{base: "18px", md: "24px"}} fontWeight={800} color="espresso">
                {progress}%
              </Text>
              <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037">
                Done
              </Text>
            </Flex>
          </Box>

          <Box>
            <Text fontSize={{base: "8px", md: "11.5px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
              Active Care Plan
            </Text>
            <Text fontSize={{base: "13px", md: "15px"}} fontWeight={700} color="espresso" mt={1} mb={1.5}>
              {activePlan ? activePlan.title : "No active plan"}
            </Text>
            <Text fontSize={{base: "10px", md: "13px"}} color="#5D4037" mb={3}>
              {activePlan 
                ? `${doneTasks} of ${activePlan.tasks.length} tasks done` 
                : "Your clinician will assign one after a visit"}
            </Text>
            
            {activePlan && (
              <Button
                size="sm"
                bg="transparent"
                border="1.5px solid"
                borderColor="brand.500"
                color="brand.500"
                borderRadius="full"
                fontWeight={600}
                fontSize={{ base: "10px", md: "13.5px" }}
                px={5}
                onClick={() => navigate("/patient/care-plans")}
                _hover={{ bg: "rgba(160,120,85,0.08)" }}
              >
                View Plan
              </Button>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
        {[
          { label: "Appointments", value: `${appointments.length}`, sub: "All time" },
          { label: "Completed", value: `${completed.length}`, sub: "Past visits" },
          { label: "Clinicians", value: `${cliniciansSeen}`, sub: "Ongoing care" },
        ].map((s) => (
          <Box
            key={s.label}
            bg="beige"
            borderRadius="20px"
            p={5}
            boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
            textAlign="center"
          >
            <Text fontSize={{base: "24px", md: "44px"}} fontWeight={800} color="brand.500" lineHeight="1.1">
              {s.value}
            </Text>
            <Text fontSize={{base: "12px", md: "16px"}} fontWeight={600} color="espresso" mt={1}>
              {s.label}
            </Text>
            <Text fontSize={{base: "10px", md: "13px"}} color="#5D4037" mt={0.5}>
              {s.sub}
            </Text>
          </Box>
        ))}
      </Grid>

      <Toast message={message} />
    </Box>
  );
}