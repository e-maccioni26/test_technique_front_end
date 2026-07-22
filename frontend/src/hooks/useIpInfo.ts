import { useQuery } from '@tanstack/react-query';

export interface IpInfoResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string; 
  timezone?: string;
}

const fetchIpInfo = async (ip: string): Promise<IpInfoResponse> => {
  const response = await fetch(`https://ipinfo.io/${ip}/json`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des informations de l'IP");
  }
  return response.json();
};

export const useIpInfo = (ip: string | null) => {
  return useQuery({
    queryKey: ['ipinfo', ip],
    queryFn: () => fetchIpInfo(ip as string),
    enabled: !!ip, 
    staleTime: 1000 * 60 * 60, 
    retry: 1,
  });
};