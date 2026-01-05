export interface Trip {
    id: string;
    company: string;
    from: string;
    to: string;
    date: string;
    time: string;
    price: number;
    type: 'BUS' | 'FLIGHT' | 'HOTEL';
    duration: string;
    logo?: string;
    guestCount?: number;
}

const BUS_COMPANIES = ['Tokat Yıldızı', 'Topçam', 'Tokat Seyahat'];
const FLIGHT_COMPANIES = ['Türk Hava Yolları', 'Pegasus'];

// In-memory storage for demo purposes
let myTrips: MyTrip[] = [];

export interface MyTrip extends Trip {
    passengerName: string;
    passengerSurname: string;
    pnr: string;
    seatNumber?: string;
    checkIn?: string;
    checkOut?: string;
    guestCount?: number;
}

export const MockDataService = {
    getTrips: (from: string, to: string, date: string, type: 'BUS' | 'FLIGHT' | 'HOTEL' = 'BUS'): Trip[] => {
        // Generate 5-10 random trips
        const count = Math.floor(Math.random() * 6) + 5;
        const trips: Trip[] = [];

        const companies = type === 'FLIGHT' ? FLIGHT_COMPANIES : BUS_COMPANIES;

        for (let i = 0; i < count; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];

            // Random time
            const hour = Math.floor(Math.random() * 18) + 6;
            const minute = Math.random() > 0.5 ? '00' : '30';
            const time = `${hour < 10 ? '0' + hour : hour}:${minute}`;

            let price;
            let duration;

            if (type === 'FLIGHT') {
                // Flight: Higher price, shorter duration
                price = Math.floor(Math.random() * 350) * 10 + 1500; // 1500 - 5000 TL
                const durHour = Math.floor(Math.random() * 2) + 1; // 1-2 hours
                const durMin = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
                duration = `${durHour}s ${durMin}dk`;
            } else {
                // Bus: Lower price, longer duration
                price = Math.floor(Math.random() * 60) * 10 + 300; // 300 - 900 TL
                const durHour = Math.floor(Math.random() * 6) + 10; // 10-15 hours
                const durMin = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
                duration = `${durHour}s ${durMin}dk`;
            }

            trips.push({
                id: Math.random().toString(36).substr(2, 9),
                company,
                from,
                to,
                date,
                time,
                price,
                type,
                duration
            });
        }

        // Sort by time
        return trips.sort((a, b) => a.time.localeCompare(b.time));
    },

    saveTrip: (trip: Omit<MyTrip, 'id' | 'pnr'>) => {
        const newTrip: MyTrip = {
            ...trip,
            id: Math.random().toString(36).substr(2, 9),
            pnr: Math.random().toString(36).substr(2, 6).toUpperCase()
        };
        myTrips.push(newTrip);
    },

    getMyTrips: (): MyTrip[] => {
        return myTrips;
    },

    getHotels: (city: string): Hotel[] => {
        const hotels: Hotel[] = [];
        const suffixes = ['Palas', 'Resort & Spa', 'City Hotel', 'Grand Hotel', 'Boutique Otel'];

        for (let i = 0; i < 5; i++) {
            const priceBase = Math.floor(Math.random() * 2000) + 1500;
            const ratingBase = (Math.random() * 1.5) + 3.5; // 3.5 - 5.0

            hotels.push({
                id: `hotel-${city}-${i}`,
                name: `${city} ${suffixes[i]}`,
                city: city,
                rating: Number(ratingBase.toFixed(1)),
                price: priceBase,
                image: HOTEL_IMAGES[i % HOTEL_IMAGES.length],
                features: ['Wifi', 'Havuz', 'Spa', 'Restoran'].sort(() => 0.5 - Math.random()).slice(0, 3)
            });
        }
        return hotels;
    }
};

export interface Hotel {
    id: string;
    name: string;
    city: string;
    rating: number;
    price: number;
    image: string;
    features: string[];
}

const HOTEL_IMAGES = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000&auto=format&fit=crop'
];
