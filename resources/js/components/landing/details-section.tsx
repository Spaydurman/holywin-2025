import MapProfile from "../ui/map-profile";
import LogoTransition from "../ui/logo-transition";
export default function DetailsSection() {


return (

    <div className="min-h-[500px] flex items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B] ">
        <div>
          <LogoTransition />
          <MapProfile />
        </div>
    </div>
);
}