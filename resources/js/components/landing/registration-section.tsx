// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Lanyard from '../ui/lanyard';
import RegistrationForm from './registration-form';

export default function RegistrationSection() {
    const [registrationCount, setRegistrationCount] = useState<number>(0);

    useEffect(() => {
        const fetchRegistrationCount = async () => {
            try {
                const response = await axios.get('/api/registrations/count');
                setRegistrationCount(response.data.count);
            } catch (error) {
                console.error('Error fetching registration count:', error);
            }
        };

        fetchRegistrationCount();
    }, []);

    const handleRegistrationSuccess = () => {
        setRegistrationCount(prevCount => prevCount + 1);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-b from-[#001636] to-[#000B1B]">
                <RegistrationForm onSuccess={handleRegistrationSuccess} />
            {/* order-first md:order-last */}
                <Lanyard
                    position={[0, 0, 20]}
                    gravity={[0, -40, 0]}
                    cardText={registrationCount.toString()}
                />
        </div>
    );
}
