const LOGGING_API = "https://20.244.56.144/evaluation-service/logs";
const BEARER_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

type Stack = "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";
export async function Log(
  level: "info" | "debug" | "warn" | "error" | "fatal",
  pkg: string,
  message: string
): Promise<void> {
  const body = {
    stack: "frontend",
    level,
    package: pkg,
    message,
  };

  try {
    await fetch(LOGGING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.warn("Logging failed:", error);
  }
}