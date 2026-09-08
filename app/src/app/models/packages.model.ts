export interface Packages {
  name: string
  version: string
  scripts: KeyValue
  private: boolean
  dependencies: KeyValue
  devDependencies: KeyValue
}

export interface KeyValue {
  [key: string]: string;
}
