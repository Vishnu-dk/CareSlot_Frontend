import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Button, Flex, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Select, Text, VStack, Alert, AlertIcon,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRegisterMutation } from "../../features/api/careslotApi";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "PATIENT" });
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();
  const toast = useToast();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Light client-side validation mirroring backend rules
  const passwordError =
    form.password.length > 0 && form.password.length < 6
      ? "Password should be at least 6 characters"
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) return;
    try {
      await register(form).unwrap();
      toast({
        title: "Account created",
        description: "Please sign in to continue.",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch {
      /* backend message rendered in Alert */
    }
  };

  return (
    <Flex minH="100vh">
      {/* ---- Left: Branding panel ---- */}
      <Box
        flex={1}
        bg="espresso"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="center"
        px={16}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" w="420px" h="420px" borderRadius="full" bg="brand.500" opacity={0.15} bottom="-120px" right="-120px" />
        <Heading color="cream" fontSize="5xl" fontWeight="800" mb={4}>
          Join CareSlot
        </Heading>
        <Text color="taupe" fontSize="lg" maxW="400px" lineHeight="tall">
          Patients get calm, guided care. Clinicians get a schedule
          that runs itself. Choose your path below.
        </Text>
      </Box>

      {/* ---- Right: Form panel ---- */}
      <Flex flex={1} align="center" justify="center" bg={{base:"espresso", md:"cream"}} px={6} py={10}>
        <Box w="full" maxW="420px">
          <VStack spacing={6} align="stretch" bg="cream"    boxShadow="lg" p={8} borderRadius="2xl">
            <Box>
              <Heading size={{base: "md", md: "lg"}} color="espresso" mb={1}>Create your account</Heading>
              <Text color="espresso" fontSize={{ base: "xs", md: "md" }} opacity={0.6}>
                It takes less than a minute.
              </Text>
            </Box>

            {error && (
              <Alert status="error" borderRadius="xl" bg="beige" color="espresso">
                <AlertIcon />
                {error?.data?.message || "Unable to register. Please try again."}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="espresso" fontSize={{ base: "xs", md: "sm" }} mb={1}>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    fontSize={{ base: "xs", md: "sm" }}
                    onChange={set("email")}
                  />
                </FormControl>

                <FormControl isRequired isInvalid={!!passwordError}>
                  <FormLabel color="espresso" fontSize={{ base: "xs", md: "sm" }} mb={1}>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    fontSize={{ base: "xs", md: "sm" }}
                  />
                  <FormErrorMessage>{passwordError}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="espresso" fontSize={{ base: "xs", md: "sm" }} mb={1}>I am a</FormLabel>
                  <Select value={form.role}  fontSize={{ base: "xs", md: "sm" }} onChange={set("role")}>
                    <option value="PATIENT">PATIENT</option>
                    <option value="CLINICIAN">CLINICIAN</option>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="primary"
                  fontSize={{ base: "sm", md: "md" }}
                  w="full"
                  mt={2}
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Text fontSize={{ base: "xs", md: "sm" }} color="espresso" opacity={0.7} textAlign="center">
              Already have an account?{" "}
              <RouterLink to="/login" style={{ color: "#A07855", fontWeight: 600 }}>
                Sign in
              </RouterLink>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}