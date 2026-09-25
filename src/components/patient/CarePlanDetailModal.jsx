import { useEffect, useState } from "react";
import {
  Box, Button, Checkbox, Flex, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Spinner, Text, VStack,
} from "@chakra-ui/react";
import { CheckCircle, Clock } from "lucide-react";
import { useGetMyCarePlansQuery, useUpdateTaskStatusMutation } from "../../features/api/careSlotApi";
import StatusBadge from "../common/StatusBadge";
import ProgressRing from "../common/ProgressRing";
import { fmtDate } from "../../utils/dates";

export default function CarePlanDetailModal({ isOpen, onClose, planId, showError }) {
  // We reuse the main query hook but filter locally or rely on RTK Query caching
  const { data: allPlans = [], isLoading } = useGetMyCarePlansQuery();
  const [updateTask, { isLoading: updating }] = useUpdateTaskStatusMutation();
  
  // Find the specific plan from the cached list
  const plan = allPlans.find(p => p.id === planId);

  // Reset local state if needed when modal opens/closes
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    if (plan) {
      setLocalTasks([...plan.tasks]);
    }
  }, [plan, isOpen]);

  const handleToggleTask = async (task) => {
    if (!plan || updating) return;

    const currentStatus = task.status;
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Optimistic Update: Change UI immediately
    setLocalTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    ));

    try {
      await updateTask({ taskId: task.id, status: newStatus }).unwrap();
      // Success: RTK Query invalidates cache, parent list updates automatically
    } catch (e) {
      // Error: Revert optimistic update
      setLocalTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: currentStatus } : t
      ));
      showError(e?.data?.message || "Failed to update task");
    }
  };

  if (!isOpen) return null;
  if (isLoading || !plan) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent><ModalBody><Spinner /></ModalBody></ModalContent>
      </Modal>
    );
  }

  const progress = Math.round(Number(plan.progressPercentage));
  const doneCount = localTasks.filter(t => t.status === "COMPLETED").length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered closeOnOverlayClick={!updating}>
      <ModalOverlay bg="rgba(62,39,35,0.4)" backdropFilter="blur(4px)" />
      
      <ModalContent 
        bg="cream" 
        borderRadius="24px" 
        boxShadow="0 28px 80px rgba(62,39,35,0.22)"
        maxH="90vh"
        overflowY="auto"
      >
        <ModalHeader pb={2} color="espresso" borderBottomWidth="1px" borderColor="taupe">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize={{base: "16px", md: "20px"}} fontWeight={700}>{plan.title}</Text>
              <Text fontSize={{base: "11px", md: "13px"}} color="#5D4037" mt={1}>
                Dr. {plan.clinicianName} · {fmtDate(plan.createdAt.slice(0,10))}
              </Text>
            </Box>
            <StatusBadge status={plan.status} />
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="espresso" _hover={{ bg: "beige" }} />

        <ModalBody pb={8} pt={6}>
          <VStack spacing={6} align="stretch">
            
            {/* Top Section: Progress & Stats */}
            <Flex gap={6} direction={{ base: "column", md: "row" }} align="center" justify="center">
               <Box position="relative" flexShrink={0}>
                 <ProgressRing value={progress} size={100} />
                 <Flex position="absolute" inset={0} direction="column" align="center" justify="center">
                   <Text fontSize={{base: "16px", md: "20px"}}  fontWeight={800} color="espresso">{progress}%</Text>
                   <Text fontSize={{base: "8px", md: "10px"}} color="#5D4037">Done</Text>
                 </Flex>
               </Box>
               
               <Box flex={1} textAlign={{ base: "center", md: "left" }}>
                 <Text fontWeight={600} color="espresso" fontSize={{base: "14px", md: "16px"}}>Overall Progress</Text>
                 <Text color="#5D4037" fontSize={{base: "12px", md: "14px"}} mt={1}>
                   {doneCount} of {localTasks.length} tasks completed
                 </Text>
                 <Text color="#5D4037" fontSize={{base: "10px", md: "12px"}} mt={2} fontStyle="italic">
                   Note: Completed tasks cannot be undone. Expired tasks cannot be started.
                 </Text>
               </Box>
            </Flex>

            {/* Task List */}
            <Box>
              <Text fontSize={{base: "12px", md: "14px"}} fontWeight={700} color="espresso" mb={3} textTransform="uppercase" letterSpacing="0.05em">
                Treatment Tasks
              </Text>
              
              <VStack spacing={3} align="stretch">
                {localTasks.map((t) => {
                  const isDone = t.status === "COMPLETED";
                  const isExpired = !isDone && new Date(t.dueDate) < new Date();
                  
                  return (
                    <Flex
                      key={t.id}
                      align="center"
                      gap={4}
                      p={4}
                      borderRadius="14px"
                      bg={isDone ? "rgba(34,197,94,0.04)" : isExpired ? "rgba(220,38,38,0.02)" : "white"}
                      border="1px solid"
                      borderColor={isDone ? "rgba(34,197,94,0.2)" : isExpired ? "rgba(220,38,38,0.2)" : "#D7CCC8"}
                      transition="all 0.2s"
                    >
                      <Checkbox
                        isChecked={isDone}
                        onChange={() => handleToggleTask(t)}
                        isDisabled={isDone || updating} // ✅ Disable if done or expired (logic handled by backend too)
                        colorScheme="green"
                        size="lg"
                        sx={{ '.chakra-checkbox__control': { w: '20px', h: '20px' } }}
                      />
                      
                      <Box flex={1}>
                        <Text 
                          fontSize={{base: "11px", md: "13px"}} 
                          fontWeight={600} 
                          color={isDone ? "#15803d" : isExpired ? "#dc2626" : "espresso"}
                          textDecoration={isDone ? "line-through" : "none"}
                          opacity={isDone ? 0.7 : 1}
                        >
                          {t.title}
                        </Text>
                        <Flex align="center" gap={2} mt={1}>
                           <Clock size={12} color={isExpired ? "#dc2626" : "#5D4037"} />
                           <Text fontSize={{base: "10px", md: "12px"}} color={isExpired ? "#dc2626" : "#5D4037"}>
                             Due {fmtDate(t.dueDate)} 
                             {isExpired && " (Expired)"}
                           </Text>
                        </Flex>
                      </Box>
                      
                      {isDone && <CheckCircle size={20} color="#15803d" />}
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            {plan.description && (
              <Box bg="beige" p={4} borderRadius="12px">
                <Text fontSize={{base: "10px", md: "12px"}} fontWeight={700} color="#5D4037" mb={1}>NOTES FROM DOCTOR:</Text>
                <Text fontSize={{base: "11px", md: "13px"}} color="espresso" lineHeight="1.5">
                  {plan.description}
                </Text>
              </Box>
            )}

          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}