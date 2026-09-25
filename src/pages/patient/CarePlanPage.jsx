import {
  useGetMyCarePlansQuery,
  useUpdateTaskStatusMutation,
} from "../../features/api/careSlotApi";
import ProgressRing from "../../components/common/ProgressRing";
import StatusBadge from "../../components/common/StatusBadge";
import Toast, { useToastMsg } from "../../components/common/Toast";
import { fmtDate } from "../../utils/dates";

import {
  Box,
  Checkbox,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function CarePlansPage() {
  const { data: plans = [], error } = useGetMyCarePlansQuery();
  const [updateTask] = useUpdateTaskStatusMutation();
  const { message, show } = useToastMsg();

  const toggleTask = async (task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await updateTask({ taskId: task.id, status: newStatus }).unwrap();
    } catch (e) {
      show(e?.data?.message || "Could not update task");
    }
  };

  if (error || plans.length === 0) {
    return (
      <Box mx="auto" py={4}>
        <Box
          bg="beige"
          borderRadius="20px"
          p={14}
          boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
          textAlign="center"
        >
          <Text fontSize="42px" mb={3}>
            📋
          </Text>
          <Text fontWeight={700} color="espresso" fontSize="18px" mb={2}>
            No care plans yet
          </Text>
          <Text fontSize="14px" color="#5D4037">
            {error?.data?.message ||
              "Your clinician will assign a plan after your next visit."}
          </Text>
        </Box>
      </Box>
    );
  }
  console.log(plans);

  return (
    <Box mx="auto" py={4}>
      <VStack align="start" spacing={1} mb={6}>
        <Text
          fontSize="11.5px"
          fontWeight={600}
          color="#5D4037"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Recovery
        </Text>
        <Heading
          fontSize="28px"
          fontWeight={800}
          color="espresso"
          letterSpacing="-0.5px"
        >
          My Care Plans
        </Heading>
      </VStack>

      {plans.map((plan) => {
        const progress = Math.round(Number(plan.progressPercentage));
        const done = plan.tasks.filter((t) => t.status === "COMPLETED").length;

        return (
          <Grid
            key={plan.id}
            templateColumns={{
              base: "1fr",
              md: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
            gap={5}
            mb={7}
          >
            <Box
              bg="beige"
              borderRadius="20px"
              p={6}
              boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
            >
              <Flex justify="space-between" align="center" mb={5}>
                <Text fontSize="18px" fontWeight={700} color="espresso">
                  {plan.title}
                </Text>
                <StatusBadge status={plan.status} />
              </Flex>

              <VStack spacing={3} align="stretch">
                {plan.tasks.map((t) => {
                  const isDone = t.status === "COMPLETED";
                  return (
                    <Flex
                      key={t.id}
                      align="center"
                      gap={4}
                      p={4}
                      borderRadius="14px"
                      bg={isDone ? "rgba(160,120,85,0.06)" : "white"}
                      border="1px solid"
                      borderColor={isDone ? "rgba(160,120,85,0.2)" : "#D7CCC8"}
                      transition="all 0.2s"
                    >
                      <Checkbox
                        isChecked={isDone}
                        onChange={() => toggleTask(t)}
                        colorScheme="brand"
                        size="lg"
                        sx={{
                          ".chakra-checkbox__control": { w: "18px", h: "18px" },
                        }}
                      />

                      <Box flex={1}>
                        <Text
                          fontSize="14px"
                          fontWeight={500}
                          color="espresso"
                          textDecoration={isDone ? "line-through" : "none"}
                          opacity={isDone ? 0.55 : 1}
                        >
                          {t.title}
                        </Text>
                        <Text fontSize="12px" color="#5D4037" mt={0.5}>
                          Due {fmtDate(t.dueDate)} · {t.weight}% weight
                        </Text>
                      </Box>

                      {isDone && (
                        <Text color="#15803d" fontWeight={700} fontSize="16px">
                          ✓
                        </Text>
                      )}
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            <VStack spacing={4} align="stretch">
              {}
              <Box
                bg="beige"
                borderRadius="20px"
                p={6}
                boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
                textAlign="center"
              >
                <Box position="relative" display="inline-block" mb={3}>
                  <ProgressRing value={progress} size={140} />
                  <Flex
                    position="absolute"
                    inset={0}
                    direction="column"
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="30px" fontWeight={800} color="espresso">
                      {progress}%
                    </Text>
                    <Text fontSize="11px" fontWeight={600} color="#5D4037">
                      Complete
                    </Text>
                  </Flex>
                </Box>

                <Text fontWeight={700} fontSize="14px" color="espresso">
                  Overall Progress
                </Text>
                <Text fontSize="12.5px" color="#5D4037" mt={1}>
                  {done} of {plan.tasks.length} tasks complete
                </Text>
              </Box>

              <Box
                bg="beige"
                borderRadius="20px"
                p={6}
                boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
              >
                <Text fontWeight={700} fontSize="14px" color="espresso" mb={3}>
                  Plan Details
                </Text>
                <VStack spacing={2} align="stretch">
                  {[
                    ["Assigned by", plan.clinicianName],
                    ["Start date", fmtDate(plan.createdAt.slice(0, 10))],
                    ["Description", plan.description || "—"],
                  ].map(([k, v]) => (
                    <Flex
                      key={k}
                      justify="space-between"
                      fontSize="13px"
                      gap={3}
                    >
                      <Text color="#5D4037" flexShrink={0}>
                        {k}
                      </Text>
                      <Text fontWeight={500} color="espresso" textAlign="right">
                        {v}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Grid>
        );
      })}

      <Toast message={message} />
    </Box>
  );
}
