export const runtime = "nodejs"; // Workaround, just to make it work with local database

import { handlers } from "@/auth"
export const { GET, POST } = handlers