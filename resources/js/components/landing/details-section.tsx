
import ProfileCard from "../ui/profile-card";
import Map from "../ui/map";

export default function DetailsSection() {


    return (

        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
            {/* <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
                <img src="/images/2825771.gif" alt="" />
            </div> */}
            {/* <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
            /> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
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
            
        </div>
    );
}
