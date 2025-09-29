// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Lanyard from '../ui/lanyard';
import RegistrationForm from './registration-form';

export default function RegistrationSection() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
            <RegistrationForm />
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
    );
}
