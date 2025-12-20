export type Message = {
  text: string;
  isAi: boolean;
};

export type Model = {
  id: string;
  name: string;
};

export type Chat = {
  id: string;
  title: string | null;
};
