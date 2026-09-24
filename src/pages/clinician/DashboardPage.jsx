import { useState } from "react";
import { format, addDays } from "date-fns";
import {
  Box, Button, Flex, Grid, Heading, HStack, Text, VStack, Spinner, useToast,
} from "@chakra-ui/react";
import { CheckCircle, ClipboardList } from "lucide-react";
import {
  useGetMyScheduleQuery,
  useCompleteAppointmentMutation,
  useCreateCarePlanMutation,
} from "../../features/api/careSlotApi";
import StatusBadge from "../../components/common/StatusBadge";
import Toast, { useToastMsg } from "../../components/common/Toast";
import { fmtDate, fmtTime } from "../../utils/dates";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function ClinicianDashboard() {
  const toast = useToast();
  const { message, show } = useToastMsg();
  
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const { data: schedule = [], isLoading , isError, error} = useGetMyScheduleQuery(
      { date: selectedDate },
  { refetchOnMountOrArgChange: true }
  );
  console.log('Schedule data:', schedule);
console.log('Is loading:', isLoading);
console.log('Is error:', isError);
console.log('Error:', error);
  const [completeAppointment, { isLoading: completing }] = useCompleteAppointmentMutation();
  const [createCarePlan, { isLoading: creatingPlan }] = useCreateCarePlanMutation();

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id).unwrap();
      show("Appointment marked as completed");
    } catch (e) {
      show(e?.data?.message || "Failed to update status");
    }
  };

  const handleCreatePlan = async (patientId) => {

    try {
      await createCarePlan({
        patientId,
        title: "Recovery Plan",
        description: "Standard post-visit care instructions.",
        tasks: [{ title: "Rest", dueDate: fmtDate(addDays(new Date(), 1)), weight: 1 }]
      }).unwrap();
      show("Care plan created for patient");
    } catch (e) {
      show(e?.data?.message || "Failed to create plan");
    }
  };

  const upcomingCount = schedule.filter(a => a.status === "BOOKED").length;

  return (
    <Box  mx="auto" py={4}>
      
      <VStack align="start" spacing={1} mb={7}>
        <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
          Welcome back
        </Text>
        <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
          Dr. Marcus Webb
        </Heading>
        <Text fontSize={{base: "11px", md: "14px"}} color="#5D4037">
          {fmtDate(selectedDate)} · {upcomingCount} pending appointments
        </Text>
      </VStack>

      <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW} mb={6}>
        <Flex justify="space-between" align="center" mb={5}>
          <Text fontSize={{base: "12px", md: "18px"}} fontWeight={700} color="espresso">Today's Schedule</Text>
          
          <HStack spacing={2}>
             <Button fontSize={{base: "9px", md: "11px"}} variant="soft" onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), -1), "yyyy-MM-dd"))}>← Prev</Button>
             <Text fontSize={{base: "11px", md: "13px"}}     fontWeight={600} color="brand.500">{fmtDate(selectedDate)}</Text>
             <Button fontSize={{base: "9px", md: "11px"}} variant="soft" onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd"))}>Next →</Button>
          </HStack>
        </Flex>

        {isLoading ? (
          <Flex justify="center" py={8}><Spinner color="brand.500" /></Flex>
        ) : schedule.length === 0 ? (
          <Text color="#5D4037" textAlign="center" fontSize={{base: "12px", md: "15px"}}  py={8}>No appointments scheduled for this day.</Text>
        ) : (
          <VStack spacing={3} align="stretch">
            {schedule.map((appt) => {
              const isDone = appt.status === "COMPLETED";
              return (
                <Flex
                  key={appt.id}
                  align="center"
                  gap={4}
                  p={4}
                  borderRadius="16px"
                  bg={isDone ? "rgba(34,197,94,0.04)" : "white"}
                  border="1px solid"
                  borderColor={isDone ? "rgba(34,197,94,0.2)" : "#D7CCC8"}
                  transition="all 0.2s"
                >
                  {/* Time Block */}
                  <Box textAlign="center" flexShrink={0} minW="58px">
                    <Text fontSize="13px" fontWeight={700} color="brand.500">
                      {fmtTime(appt.startsAt.slice(11, 16))}
                    </Text>
                    <Text fontSize="11px" color="#5D4037">30 min</Text>
                  </Box>

                  {/* Divider */}
                  <Box w="1px" h="38px" bg="#D7CCC8" flexShrink={0} />

                  {/* Patient Info */}
                  <Flex align="center" gap={3} flex={1}>
                    <Flex
                      w="38px" h="38px" borderRadius="full" bg="brand.500"
                      align="center" justify="center" color="white"
                      fontSize={{base: "11px", md: "12.5px"}} fontWeight={700} flexShrink={0}
                    >
                      {(appt.patientName || "PA").slice(0, 2).toUpperCase()}
                    </Flex>
                    <Box>
                      <Text fontWeight={700} fontSize={{base: "12px", md: "14px"}} color="espresso">
                        {appt.patientName || "Unknown Patient"}
                      </Text>
                      <Text fontSize={{base: "11px", md: "12.5px"}} color="#5D4037">
                        {appt.reason || "General Consultation"}
                      </Text>
                    </Box>
                  </Flex>

                  <HStack spacing={2} align="center">
                    {isDone ? (
                      <StatusBadge status="COMPLETED" />
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<CheckCircle size={14} />}
                          onClick={() => handleComplete(appt.id)}
                          isLoading={completing}
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          bg="transparent"
                          border="1.5px solid"
                          borderColor="brand.500"
                          color="brand.500"
                          borderRadius="full"
                          fontWeight={600}
                          fontSize={{base: "11px", md: "12.5px"}}
                          px={3}
                          leftIcon={<ClipboardList size={14} />}
                          onClick={() => handleCreatePlan(appt.patientId)}
                          isLoading={creatingPlan}
                        >
                          Create Plan
                        </Button>
                      </>
                    )}
                  </HStack>
                </Flex>
              );
            })}
          </VStack>
        )}
      </Box>

      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
        {[
          { label: "Seen Today", value: `${schedule.filter(a => a.status === 'COMPLETED').length}`, sub: "of total" },
          { label: "Pending", value: `${upcomingCount}`, sub: "appointments" },
        ].map((stat) => (
          <Box key={stat.label} bg="beige" borderRadius="20px" p={5} boxShadow={CARD_SHADOW} textAlign="center">
            <Text fontSize={{base: "24px", md: "32px"}} fontWeight={800} color="brand.500" lineHeight="1.1">
              {stat.value}
            </Text>
            <Text fontSize={{base: "12px", md: "14px"}} fontWeight={600} color="espresso" mt={1}>{stat.label}</Text>
            <Text fontSize={{base: "12px", md: "14px"}} color="#5D4037" mt={0.5}>{stat.sub}</Text>
          </Box>
        ))}
      </Grid>

      <Toast message={message} />
    </Box>
  );
}