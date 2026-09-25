import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Spinner,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { useGetMyCarePlansQuery } from "../../features/api/careSlotApi";
import StatusBadge from "../../components/common/StatusBadge";
import ProgressRing from "../../components/common/ProgressRing";
import Toast, { useToastMsg } from "../../components/common/Toast";
import { fmtDate } from "../../utils/dates";
import CarePlanDetailModal from "../../components/patient/CarePlanDetailModal";
import ProgressMiniRing from "../../components/common/ProgressMiniRing";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function CarePlansListPage() {
  const { data: plans = [], isLoading, error } = useGetMyCarePlansQuery();
  const { message, show } = useToastMsg();

  const [selectedPlanId, setSelectedPlanId] = useState(null);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="brand.500" thickness="3px" />
      </Flex>
    );
  }

  if (error || plans.length === 0) {
    return (
      <Box maxW="900px" mx="auto" py={4}>
        <Box
          bg="beige"
          borderRadius="20px"
          p={14}
          boxShadow={CARD_SHADOW}
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

  return (
    <Box mx="auto" py={4}>
      <VStack align="start" spacing={1} mb={6}>
        <Text
          fontSize={{ base: "8px", md: "12px" }}
          fontWeight={600}
          color="#5D4037"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Recovery
        </Text>
        <Heading
          fontSize={{ base: "24px", md: "30px" }}
          fontWeight={800}
          color="espresso"
          letterSpacing="-0.5px"
        >
          My Care Plans
        </Heading>
        <Text fontSize={{ base: "12px", md: "14px" }} color="#5D4037">
          Tap a plan to view tasks and update progress.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {plans.map((plan) => {
          const progress = Math.round(Number(plan.progressPercentage));
          const doneCount = plan.tasks.filter(
            (t) => t.status === "COMPLETED",
          ).length;

          return (
            <Box
              key={plan.id}
              bg="beige"
              borderRadius="20px"
              p={6}
              boxShadow={CARD_SHADOW}
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(62,39,35,0.1)",
              }}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <Flex justify="space-between" align="start" mb={4}>
                <Box flex={1} pr={4}>
                  <Text
                    fontSize={{ base: "16px", md: "18px" }}
                    fontWeight={700}
                    color="espresso"
                    lineClamp={1}
                  >
                    {plan.title}
                  </Text>
                  <Text
                    fontSize={{ base: "11px", md: "13px" }}
                    color="#5D4037"
                    mt={1}
                  >
                    Assigned by {plan.clinicianName}
                  </Text>
                  <Text
                    fontSize={{ base: "9px", md: "11px" }}
                    color="#5D4037"
                    opacity={0.7}
                    mt={1}
                  >
                    Started: {fmtDate(plan.createdAt.slice(0, 10))}
                  </Text>
                </Box>

                <Box position="relative" w="50px" h="50px" flexShrink={0}>
                  <ProgressMiniRing value={progress} />
                  <Flex
                    position="absolute"
                    inset={0}
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize={{ base: "8px", md: "10px" }}
                      fontWeight={800}
                      color="espresso"
                    >
                      {progress}%
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                pt={3}
                borderTopWidth="1px"
                borderColor="taupe"
              >
                <StatusBadge status={plan.status} />
                <Flex
                  align="center"
                  gap={1}
                  color="brand.500"
                  fontWeight={600}
                  fontSize={{ base: "11px", md: "13px" }}
                >
                  <Text>
                    {doneCount}/{plan.tasks.length} Tasks
                  </Text>
                  <ChevronRight size={16} />
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </SimpleGrid>

      {}
      <CarePlanDetailModal
        isOpen={!!selectedPlanId}
        onClose={() => setSelectedPlanId(null)}
        planId={selectedPlanId}
        showError={show}
      />

      <Toast message={message} />
    </Box>
  );
}
