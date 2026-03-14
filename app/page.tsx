import { redirect } from "next/navigation";

export default function RootPage() {
  // This will trigger immediately on the server
  redirect("/login");
  
  // This part never actually renders
  return null;
}