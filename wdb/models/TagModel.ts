export interface Tag {}

export class NameTagModel implements Tag {
  name: string;
}

export class KvpTagModel implements Tag {
  key: string;
  value: string;
}
