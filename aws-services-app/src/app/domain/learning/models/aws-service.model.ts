export interface FlashCardMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface FlashCardCategory {
  name: string;
  services: FlashCardMetadata[];
}

