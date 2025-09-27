import ProfileCard from "../ui/profile-card";
import Map from "../ui/map";


export default function DetailsSection() {


    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 w-full bg-gradient-to-b from-[#000B1B] to-[#001636] ">
            
            <div className="w-full flex items-center justify-center">
                <div className="relative">
                    {/* Circle with diameter slightly larger than 400px */}
                    <div className="dashed-circle-border">
                        <Map className="mt-0 rounded-xl" style={{ width: '400px', height: '400px' }} />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <ProfileCard
                    name="Clark V."
                    title="Software Engineer"
                    handle="javicodes"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/images/clark.png"
                    className="cursor-target"

                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('Contact clicked')}
                />
            </div>
        </div>
    );
}