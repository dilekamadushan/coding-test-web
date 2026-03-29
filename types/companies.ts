export interface ColorSettings {
  brandColor: string;
}

export interface Event {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  fiscalPeriod: string;
  fiscalYear: string;
  qnaTimestamp: number | null;
  reportUrl: string | null;
  pdfUrl: string | null;
  audioUrl?: string | null;
}

export interface Company {
  companyId: number;
  companyName: string;
  displayName: string;
  companyCountry: string;
  companyTicker: string;
  infoUrl: string;
  liveUrl: string;
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  iconUrl: string | null;
  description: string;
  reportingCurrency: string;
  colorSettings: ColorSettings;
  events: Event[];
  isins: string[];
}

export interface CompaniesPagination {
  companies: Company[];
  totalCount: number;
  totalPages: number;
}

/* reuseable type for API response */
export interface ApiResponse<T> {
  data: T;
}
