export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      signIn: undefined;
      signUp: undefined;
      home: undefined;
      createTicket: undefined;      
      detailsTicket: { ticketId: string };
    }
  }
}