/**
 * API response and request types
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: ResponseMeta;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
}

export interface DateRangeParams {
  from?: string; // ISO date
  to?: string; // ISO date
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: string;
  type?: string;
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, SortParams, DateRangeParams, FilterParams {}

// WebSocket event types
export interface WebSocketEvent<T = any> {
  event: string;
  data: T;
  timestamp: string;
}

export interface MessageCreatedEvent {
  message_id: string;
  sender_id: string;
  content: string;
}

export interface PlanUpdatedEvent {
  plan_id: string;
  user_id: string;
  changes: string[];
}

export interface TaskStatusEvent {
  task_id: string;
  plan_id: string;
  status: string;
  completed_at?: string;
}
