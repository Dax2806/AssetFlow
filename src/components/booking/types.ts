import { BookingStatus } from '../../types';

export type ResourceCategory = 'Meeting Rooms' | 'Vehicles' | 'Equipment' | 'Projectors' | 'Labs';

export interface BookingResource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  capacity?: number; // e.g. seats
  features: string[]; // e.g. ["4K Display", "Video Conf", "AC"]
  imageUrl: string;
  location: string;
  utilizationWeek: number; // weekly usage %
  utilizationMonth: number; // monthly usage %
  tag: string; // e.g. "RES-401"
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  bookedBy: string;
  department: string;
  userEmail: string;
  purpose: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  status: BookingStatus;
  attendees?: string[]; // attendee names or emails
  notes?: string;
  durationMinutes: number;
}
