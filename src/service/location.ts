import { IPGeoLocation } from "../interface/location";


const ipCache: Map<string, IPGeoLocation> = new Map();

export const getLocation = async (ip: string): Promise<IPGeoLocation | null> => {
    // Check if the IP is already in the cache
    if (ipCache.has(ip)) {
        return ipCache.get(ip) || null;
    }

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`, {
            method: "GET",
        });

        if (response.ok) {
            const data: IPGeoLocation = await response.json();

            // Store the data in the cache
            ipCache.set(ip, data);

            return data;
        } else {
            console.error(`Failed to fetch location: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        return null;
    }
};
