import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/api/careslotApi";
import { setCredentials } from "../../features/auth/authSlice";
import { ROLE_HOME } from "../../routes/roleHome";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      navigate(ROLE_HOME[result.role] || "/login");
    } catch {}
  };

  return (
    <Flex minH="100vh">
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
        <Box
          position="absolute"
          w="420px"
          h="420px"
          borderRadius="full"
          bg="brand.500"
          opacity={0.15}
          top="-120px"
          left="-120px"
        />
        <Box
          position="absolute"
          w="320px"
          h="320px"
          borderRadius="full"
          border="1px solid"
          borderColor="brand.500"
          opacity={0.35}
          bottom="-90px"
          right="-70px"
        />

        <Heading color="cream" fontSize="5xl" fontWeight="800" mb={4}>
          CareSlot
        </Heading>
        <Text color="taupe" fontSize="lg" maxW="400px" lineHeight="tall">
          Calm, connected care. Book visits, follow your care plan, and stay on
          track — all in one place.
        </Text>
      </Box>

      <Flex
        flex={1}
        align="center"
        justify="center"
        bg={{ base: "espresso", md: "cream" }}
        px={6}
      >
        <Box w="full" maxW="420px">
          <VStack
            spacing={6}
            align="stretch"
            bg="cream"
            boxShadow="lg"
            p={8}
            borderRadius="2xl"
          >
            <Box>
              <Heading size={{ base: "md", md: "lg" }} color="espresso" mb={1}>
                Welcome back
              </Heading>
              <Text
                color="espresso"
                fontSize={{ base: "xs", md: "md" }}
                opacity={0.6}
              >
                Sign in to continue to your portal.
              </Text>
            </Box>

            {error && (
              <Alert
                status="error"
                fontSize={{ base: "10px", md: "md" }}
                borderRadius="xl"
                bg="beige"
                color="espresso"
              >
                <AlertIcon size={16} />
                {error?.data?.message || "Unable to sign in. Please try again."}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel
                    color="espresso"
                    fontSize={{ base: "xs", md: "sm" }}
                    mb={1}
                  >
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    fontSize={{ base: "xs", md: "sm" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    color="espresso"
                    fontSize={{ base: "xs", md: "sm" }}
                    mb={1}
                  >
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    fontSize={{ base: "xs", md: "sm" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  variant="primary"
                  fontSize={{ base: "sm", md: "md" }}
                  w="full"
                  mt={2}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="espresso"
              opacity={0.7}
              textAlign="center"
            >
              New to CareSlot ?{" "}
              <RouterLink
                to="/register"
                style={{ color: "#A07855", fontWeight: 600 }}
              >
                Create an account
              </RouterLink>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
