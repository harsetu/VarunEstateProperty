// Analytics event names — one place so reports stay consistent.
export const AnalyticsEvent = {
  pageView: 'page_view',
  whatsappClick: 'whatsapp_click',
  callClick: 'call_click',
  searchSubmit: 'search_submit',
  siteVisitRequest: 'site_visit_request',
  callbackRequest: 'callback_request',
  contactSubmit: 'contact_submit',
  propertyView: 'property_view',
  adminLogin: 'admin_login',
  adminLoginFailed: 'admin_login_failed',
  adminPublish: 'admin_publish',
  adminDelete: 'admin_delete',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];
