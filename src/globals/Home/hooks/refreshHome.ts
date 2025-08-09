import { revalidatePath } from "next/cache";

export default function refreshHome() {
  revalidatePath("/");
}
