import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  FormControl,
  FormLabel,
  IconButton,
  NumberInput,
  NumberInputField,
  Spinner,
} from "@chakra-ui/react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";

export default function CarePlanModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  patientName = "Patient",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: Date.now(),
      title: "",
      dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      weight: 10,
    },
  ]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTasks([
      {
        id: Date.now(),
        title: "",
        dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        weight: 10,
      },
    ]);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: "",
        dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        weight: 10,
      },
    ]);
  };

  const removeTask = (id) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please enter a plan title");
    const validTasks = tasks.filter((t) => t.title.trim() && t.dueDate);
    if (validTasks.length === 0)
      return alert("Please add at least one valid task");

    try {
      await onSubmit({
        title,
        description,
        tasks: validTasks.map(({ title, dueDate, weight }) => ({
          title,
          dueDate,
          weight: parseInt(weight) || 0,
        })),
      });
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      isCentered
      closeOnOverlayClick={!isLoading}
    >
      <ModalOverlay bg="rgba(62,39,35,0.4)" backdropFilter="blur(4px)" />

      <ModalContent
        bg="cream"
        borderRadius="24px"
        boxShadow="0 28px 80px rgba(62,39,35,0.22)"
        maxH="90vh"
        overflowY="auto"
      >
        <ModalHeader pb={2} color="espresso">
          <Text fontSize="20px" fontWeight={700}>
            Create Care Plan
          </Text>
          <Text fontSize="13px" color="#5D4037" mt={1}>
            For {patientName}
          </Text>
        </ModalHeader>
        <ModalCloseButton color="espresso" _hover={{ bg: "beige" }} />

        <ModalBody pb={8}>
          <VStack spacing={6} align="stretch">
            <Box>
              <FormControl mb={4} isRequired>
                <FormLabel fontSize="13px" fontWeight={600} color="espresso">
                  Plan Title
                </FormLabel>
                <Input
                  placeholder="e.g., Post-Op Recovery Phase 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  bg="white"
                  borderColor="taupe"
                  _focus={{ borderColor: "brand.500" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight={600} color="espresso">
                  Description
                </FormLabel>
                <Input
                  as="textarea"
                  rows={3}
                  placeholder="Brief summary of the treatment goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  bg="white"
                  borderColor="taupe"
                  resize="vertical"
                  _focus={{ borderColor: "brand.500" }}
                />
              </FormControl>
            </Box>

            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontSize="15px" fontWeight={700} color="espresso">
                  Treatment Tasks
                </Text>
                <Button
                  size="xs"
                  variant="soft"
                  leftIcon={<Plus size={14} />}
                  onClick={addTask}
                  bg="beige"
                  color="brand.600"
                  _hover={{ bg: "taupe" }}
                >
                  Add Task
                </Button>
              </Flex>

              <VStack spacing={3} align="stretch">
                {tasks.map((task, index) => (
                  <Box
                    key={task.id}
                    p={4}
                    bg="white"
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="taupe"
                  >
                    <Flex
                      gap={3}
                      direction={{ base: "column", md: "row" }}
                      align="start"
                    >
                      <Box flex={2}>
                        <FormLabel fontSize="11px" color="#5D4037" mb={1}>
                          Task Name
                        </FormLabel>
                        <Input
                          size="sm"
                          placeholder="e.g., Take medication twice daily"
                          value={task.title}
                          onChange={(e) =>
                            updateTask(task.id, "title", e.target.value)
                          }
                          borderColor="transparent"
                          _hover={{ borderColor: "taupe" }}
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </Box>

                      <Box flex={1}>
                        <FormLabel fontSize="11px" color="#5D4037" mb={1}>
                          Due Date
                        </FormLabel>
                        <Input
                          type="date"
                          size="sm"
                          value={task.dueDate}
                          onChange={(e) =>
                            updateTask(task.id, "dueDate", e.target.value)
                          }
                          borderColor="transparent"
                          _hover={{ borderColor: "taupe" }}
                          _focus={{ borderColor: "brand.500" }}
                        />
                      </Box>

                      <Box w="80px">
                        <FormLabel fontSize="11px" color="#5D4037" mb={1}>
                          Weight %
                        </FormLabel>
                        <NumberInput
                          size="sm"
                          min={0}
                          max={100}
                          value={task.weight}
                          onChange={(valStr) =>
                            updateTask(task.id, "weight", valStr)
                          }
                        >
                          <NumberInputField
                            borderColor="transparent"
                            _hover={{ borderColor: "taupe" }}
                            _focus={{ borderColor: "brand.500" }}
                          />
                        </NumberInput>
                      </Box>

                      <Box pt={6}>
                        <IconButton
                          aria-label="Remove task"
                          icon={<Trash2 size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeTask(task.id)}
                          isDisabled={tasks.length === 1}
                        />
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Flex
              justify="flex-end"
              gap={3}
              pt={4}
              borderTopWidth="1px"
              borderColor="taupe"
            >
              <Button
                onClick={handleClose}
                variant="ghost"
                color="espresso"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Creating..."
              >
                Save Care Plan
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
