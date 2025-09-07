
import {ModeToggle} from "@/components/theme/ModeToggle";
import {Dashboard} from "@/components/sections/dashboard/Dashboard";


export default function Home() {
  return (
   <div>
    <div>
    <ModeToggle/>
        <Dashboard/>
    </div>
   </div>
  );
}
