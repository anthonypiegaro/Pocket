import { ThemeToggle } from "@/components/theme-toggle";
import { Profile } from "@/app/landing-page/profile";

export default function Page() {
  return (
    <div>
      <h1>Landing Page</h1>
      <ThemeToggle />
      <Profile />
    </div>
  );
}
