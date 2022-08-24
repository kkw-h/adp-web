// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    code?: number;
    type?: string;
    description?: string;
    user?: UserInfo;
    access_token?: string
  };
  type UserInfo = {
    id: string;
    name: string;
    username: string;
    bio?: string;
    status?: string
    avatar?: Avatar
  }
  type Avatar = {
    id: string;
    url: string;
    filename: string;
  }

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    phone_number?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
  type UploadInfoBody = {
    filename: string;
    parts: number;
    size: string;
    type: string;
    mime_type: string;
    extra: string,
    hash: string[]
  }
  type UploadInfoUrlResult = {
    ForceQuery: boolean;
    Fragment: string;
    Host: string;
    Opaque: string;
    Path: string;
    RawFragment: string;
    RawPath: string;
    RawQuery: string;
    Scheme: string;
    User: string;
  }
  type UploadInfoResult = {
    file_id: string;
    file_name: string;
    url: UploadInfoUrlResult[];
  }
}
declare namespace APICourse {
  type CourseClassify = {
    id: string;
    introduction: string;
    level: number;
    name: string;
    parent_id: string;
    subclass: CourseClassify[]
  }
}
