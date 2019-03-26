export interface AuthData {
  email: string;
  password: string;//you wouldn't want to have the user and password in one model in the front-end to possess security risk. WHen you do need a user value, you would store it somehwere else.
}
