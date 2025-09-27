export interface Connection {
  id: string;
  name: string;
  profilePicture?: string;
  occupation?: string;
  company?: string;
  companyLogo?: string;
  position?: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  experience?: Experience[];
}

export interface Experience {
  companyName: string;
  title: string;
  companyLogo?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}
