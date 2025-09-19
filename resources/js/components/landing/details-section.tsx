
import ProfileCard from "../ui/profile-card";
export default function DetailsSection() {


    return (

        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
            <ProfileCard
                    name="Clark V."
                    title="Software Engineer"
                    handle="javicodes"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/images/clark.png"

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
