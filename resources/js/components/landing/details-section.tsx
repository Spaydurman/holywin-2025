
import ProfileCard from "../ui/profile-card";
import TargetCursor from "../ui/target-cursor";

export default function DetailsSection() {


    return (

        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
            {/* <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
                <img src="/images/2825771.gif" alt="" />
            </div> */}
            {/* <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
            /> */}
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
            <div className="max-w-6xl w-full">

            </div>
        </div>
    );
}
