import { IssueTypes, StringBoolean } from "./common";

export interface IssuesResponse {
  paging:     Paging;
  issues:     Issue[];
  components: IssuesComponent[];
  rules:      Rule[];
  users:      User[];
}

export interface IssuesComponent {
  key:       string;
  enabled:   boolean;
  qualifier: string;
  name:      string;
  longName:  string;
  path?:     string;
}

export interface Issue {
  key:          string;
  component:    string;
  project:      string;
  rule:         string;
  status:       string;
  resolution:   string;
  severity:     string;
  message:      string;
  line:         number;
  hash:         string;
  author:       string;
  effort:       string;
  creationDate: string;
  updateDate:   string;
  tags:         string[];
  type:         string;
  comments:     Comment[];
  attr:         Attr;
  transitions:  string[];
  actions:      string[];
  textRange:    TextRange;
  flows:        Flow[];
}

export interface Attr {
  "jira-issue-key": string;
}

export interface Comment {
  key:       string;
  login:     string;
  htmlText:  string;
  markdown:  string;
  updatable: boolean;
  createdAt: string;
}

export interface Flow {
  locations: Location[];
}

export interface Location {
  textRange: TextRange;
  msg:       string;
}

export interface TextRange {
  startLine:   number;
  endLine:     number;
  startOffset: number;
  endOffset:   number;
}

export interface Paging {
  pageIndex: number;
  pageSize:  number;
  total:     number;
}

export interface Rule {
  key:      string;
  name:     string;
  status:   string;
  lang:     string;
  langName: string;
}

export interface User {
  login:  string;
  name:   string;
  active: boolean;
  avatar: string;
}

export enum AdditionalFields{
  ALL = '_all',
  COMMENTS = 'comments',
  LANG = 'languages',
  ACTION_PLANS = 'actionsPlans',
  RULES = 'rules',
  TRANSITIONS = 'transitions',
  ACTIONS = 'actions',
  USERS = 'users'
}

export interface SearchIssuesParams{
  additionalFields?: AdditionalFields,
  /**@default 'true' */
  asc?: StringBoolean,
  assigned?:StringBoolean,
  /**
   * Comma-separated list of assignee logins. 
   * The value '__me__' can be used as a placeholder 
   * for user who performs the request
   * 
   * @example ['admin','usera']
   */
  assignees?: string[] | string;
  /**
   * Comma-separated list of assignee logins. 
   * The value '__me__' can be used as a placeholder 
   * for user who performs the request
   */
  author?: string;
  componentKeys?: string[];
  /**
   * 1-based page number
   */
  p?: number;
  /**
   * Page size. Must be greater than 0 and less or equal than 500
   */
  ps?: 500;
  types?: IssueTypes[]
}