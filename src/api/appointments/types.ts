export interface Appointment {
  id: string;
  title: string;
  clientIds: string[];
  userIds: string[];
  startTime: string;
  endTime: string;
  companyId: string;
}
